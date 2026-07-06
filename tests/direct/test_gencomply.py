"""
Direct-mode tests for GenComply — mocks web + LLM (no Studio required).

Run: pytest tests/direct/test_gencomply.py -v
"""

import json

import pytest

CONTRACT = "contracts/gencomply.py"

REGISTER_MOCK = json.dumps(
    {
        "valid": True,
        "work_type_match": True,
        "fingerprint_summary": "Policy promises no third-party trackers; suspect page loads analytics before consent.",
        "reject_reason": None,
        "confidence_percent": 90,
    },
    sort_keys=True,
)

INFRINGEMENT_MOCK = json.dumps(
    {
        "decision": "INFRINGEMENT_CONFIRMED",
        "infringement_types": ["verbatim_copy"],
        "similarity_score": 0.91,
        "fair_use_likely": False,
        "confidence_percent": 88,
        "evidence_summary": "Opening 3 paragraphs are nearly identical.",
        "recommended_action": "PAY_BOUNTY",
    },
    sort_keys=True,
)

NOT_INFRINGEMENT_MOCK = json.dumps(
    {
        "decision": "NOT_INFRINGEMENT",
        "infringement_types": [],
        "similarity_score": 0.12,
        "fair_use_likely": False,
        "confidence_percent": 85,
        "evidence_summary": "Different topic and structure.",
        "recommended_action": "NONE",
    },
    sort_keys=True,
)


@pytest.fixture
def contract(direct_vm, direct_deploy, direct_alice):
    direct_vm.mock_web(r".*", "Privacy policy: no third-party trackers. Cookie consent required.")
    direct_vm.mock_llm(r".*compliance policy registrar.*", REGISTER_MOCK)
    direct_vm.mock_llm(r".*compliance jury.*", INFRINGEMENT_MOCK)
    direct_vm.sender = direct_alice
    return direct_deploy(CONTRACT)


class TestRegisterWork:
    def test_register_returns_work_id(self, contract):
        urls = json.dumps(["https://example.com/original-post"])
        work_id = contract.register_work(
            "Acme Privacy Policy",
            "privacy_policy",
            urls,
            "GDPR: opt-out available. No non-essential cookies before consent.",
            75,
        )
        assert work_id.startswith("work_")
        work = contract.get_work(work_id)
        assert work["title"] == "Acme Privacy Policy"
        assert work["status"] == "ACTIVE"
        assert len(work["fingerprint_summary"]) > 10

    def test_list_work_ids(self, contract):
        urls = json.dumps(["https://example.com/a"])
        contract.register_work("A", "privacy_policy", urls, "GDPR terms")
        ids = contract.list_work_ids()
        assert len(ids) >= 1

    def test_register_rejects_invalid_work_type_match(self, contract, direct_vm):
        direct_vm.clear_mocks()
        direct_vm.mock_web(r".*", "Privacy policy: no third-party trackers.")
        direct_vm.mock_llm(
            r".*compliance policy registrar.*",
            json.dumps(
                {
                    "valid": True,
                    "work_type_match": False,
                    "fingerprint_summary": "x" * 30,
                    "reject_reason": None,
                    "confidence_percent": 90,
                },
                sort_keys=True,
            ),
        )
        urls = json.dumps(["https://example.com/policy"])
        from gltest.direct import ContractRollback

        with pytest.raises((ContractRollback, Exception)):
            contract.register_work(
                "Bad match",
                "privacy_policy",
                urls,
                "cookie consent required",
            )


class TestBountyAndReport:
    def test_fund_bounty(self, contract, direct_vm, direct_alice):
        urls = json.dumps(["https://example.com/original"])
        work_id = contract.register_work("Title", "privacy_policy", urls, "cookie consent required")
        direct_vm.value = 10**18
        contract.fund_bounty(work_id)
        work = contract.get_work(work_id)
        assert work["bounty_pool"] == 10**18

    def test_report_infringement_confirmed(self, contract, direct_vm, direct_alice):
        urls = json.dumps(["https://example.com/original"])
        work_id = contract.register_work("Title", "privacy_policy", urls, "no trackers before consent")
        direct_vm.value = 10 * 10**18
        contract.fund_bounty(work_id)
        report_id = contract.report_infringement(
            work_id, "https://example.com/copy-site"
        )
        report = contract.get_report(report_id)
        assert report["status"] == "CONFIRMED"
        assert report["decision"] == "INFRINGEMENT_CONFIRMED"
        work = contract.get_work(work_id)
        assert work["bounty_pool"] < 10 * 10**18

    def test_report_rejected(self, contract, direct_vm, direct_alice):
        direct_vm.clear_mocks()
        direct_vm.mock_web(r".*", "Unrelated content.")
        direct_vm.mock_llm(r".*compliance policy registrar.*", REGISTER_MOCK)
        direct_vm.mock_llm(r".*compliance jury.*", NOT_INFRINGEMENT_MOCK)
        urls = json.dumps(["https://example.com/original"])
        work_id = contract.register_work("Title", "privacy_policy", urls, "no trackers before consent")
        direct_vm.value = 5 * 10**18
        contract.fund_bounty(work_id)
        report_id = contract.report_infringement(work_id, "https://other.com/page")
        report = contract.get_report(report_id)
        assert report["status"] == "REJECTED"

    def test_duplicate_url_reverts(self, contract, direct_vm, direct_alice):
        urls = json.dumps(["https://example.com/original"])
        work_id = contract.register_work("Title", "privacy_policy", urls, "no trackers before consent")
        direct_vm.value = 10**18
        contract.fund_bounty(work_id)
        contract.report_infringement(work_id, "https://dup.com/page")
        from gltest.direct import ContractRollback

        with pytest.raises((ContractRollback, Exception)):
            contract.report_infringement(work_id, "https://dup.com/page")

    def test_empty_bounty_reverts(self, contract):
        urls = json.dumps(["https://example.com/original"])
        work_id = contract.register_work("Title", "privacy_policy", urls, "no trackers before consent")
        from gltest.direct import ContractRollback

        with pytest.raises((ContractRollback, Exception)):
            contract.report_infringement(work_id, "https://suspect.com/x")

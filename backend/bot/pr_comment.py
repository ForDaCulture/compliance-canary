from fastapi import APIRouter, Request, Header, HTTPException
import github

router = APIRouter()

@router.post("/github/event")
async def push_event(request: Request,
                     x_hub_signature: str = Header(None)):
    event = await request.json()
    # verify sig skipped for brevity
    findings = parse_findings_from_sha(repo=event["repository"]["full_name"], sha=event["after"])
    if findings:
        g = github.Github(os.environ["GITHUB_APP"])
        repo = g.get_repo(event["repository"]["full_name"])
        pr = repo.create_comment(
            "Pull Request",
            f"⚠️ Detected new detections – full report at {findings_url}")

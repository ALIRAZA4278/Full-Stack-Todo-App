# Backend Agent Instructions

This is the FastAPI backend for the Hackathon Todo Phase II application.

## Technology Stack

- **Framework**: FastAPI
- **Language**: Python 3.11+
- **ORM**: SQLModel (SQLAlchemy-based)
- **Database**: Neon PostgreSQL
- **JWT**: python-jose

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py             # FastAPI app, CORS, startup
│   ├── config.py           # Settings from environment
│   ├── db.py               # Database connection, SessionLocal
│   ├── models.py           # Task SQLModel
│   ├── schemas.py          # Pydantic request/response schemas
│   ├── dependencies.py     # get_current_user JWT verification
│   └── routes/
│       ├── __init__.py
│       └── tasks.py        # Task CRUD endpoints
└── requirements.txt
```

## Key Rules

1. **JWT Verification**: Every endpoint must verify JWT token via `get_current_user` dependency
2. **User Isolation (NON-NEGOTIABLE)**:
   - URL `{user_id}` MUST match JWT `sub` claim
   - Every query MUST include `WHERE user_id = :jwt_user_id`
3. **Error Format**: Always return `{"detail": "message"}`
4. **Timestamps**: Use UTC, format as ISO 8601
5. **Validation**: Use Pydantic schemas for request/response validation

## Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/{user_id}/tasks | List user's tasks |
| POST | /api/{user_id}/tasks | Create task |
| GET | /api/{user_id}/tasks/{id} | Get single task |
| PUT | /api/{user_id}/tasks/{id} | Update task |
| DELETE | /api/{user_id}/tasks/{id} | Delete task |
| PATCH | /api/{user_id}/tasks/{id}/complete | Toggle completion |

## Security Checklist

- [ ] JWT token extracted from Authorization header
- [ ] Token signature verified with BETTER_AUTH_SECRET
- [ ] Token expiration checked
- [ ] URL user_id compared with JWT sub claim
- [ ] Database queries filtered by user_id
- [ ] 404 returned for non-existent OR unauthorized resources

## Environment Variables

Required in `.env`:
- `BETTER_AUTH_SECRET` - JWT verification secret (must match frontend)
- `DATABASE_URL` - Neon PostgreSQL connection string
- `FRONTEND_URL` - Frontend URL for CORS

## Running Locally

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # or .venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

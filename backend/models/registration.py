from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional
from enum import Enum


class EducationLevel(str, Enum):
    HIGH_SCHOOL = "high_school"
    POST_SECONDARY = "post_secondary"
    RECENT_GRADUATE = "recent_graduate"
    OTHER = "other"


class RegistrationRequest(BaseModel):
    # Demographics
    education_level: EducationLevel
    education_level_other: Optional[str] = Field(None, max_length=200)  # For 'other' education level
    grade: Optional[str] = None  # For high school: 10, 11, 12
    year: Optional[str] = None   # For post-secondary: 1st, 2nd, 3rd, 4th, 5th+
    major: Optional[str] = Field(None, max_length=200)  # For post-secondary and recent graduates
    gender_identity: str = Field(..., min_length=1, max_length=100)
    dietary_restrictions: Optional[str] = Field(None, max_length=200)

    # Experience
    hackathon_experience: bool = False
    hackathon_count: Optional[int] = Field(None, ge=1, le=100)
    relevant_skills: Optional[str] = Field(None, max_length=1000)
    interested_in_beginner: bool = False

    # Interest
    why_interested: str = Field(..., min_length=10, max_length=2000)
    creative_project: str = Field(..., min_length=10, max_length=1000)  # ~150 words

    # Logistics
    staying_overnight: bool = False
    general_comments: Optional[str] = Field(None, max_length=1000)

    # Consent
    rules_consent: bool = False
    is_minor: bool = False

    @field_validator('creative_project')
    @classmethod
    def validate_word_count(cls, v):
        word_count = len(v.split())
        if word_count > 150:
            raise ValueError('Creative project description must be 150 words or less')
        return v

    @field_validator('grade')
    @classmethod
    def validate_grade(cls, v, info):
        if v is not None:
            if v not in ['10', '11', '12']:
                raise ValueError('Grade must be 10, 11, or 12')
        return v

    @field_validator('year')
    @classmethod
    def validate_year(cls, v, info):
        if v is not None:
            if v not in ['1st', '2nd', '3rd', '4th', '5th+']:
                raise ValueError('Year must be 1st, 2nd, 3rd, 4th, or 5th+')
        return v

    @field_validator('rules_consent')
    @classmethod
    def validate_rules_consent(cls, v):
        if not v:
            raise ValueError('You must agree to the rules to register')
        return v


class RegistrationResponse(BaseModel):
    id: str
    user_id: str
    email: str
    full_name: str
    education_level: str
    created_at: str
    status: str = "registered"
    message: str = "Registration successful"

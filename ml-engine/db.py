import os

from dotenv import load_dotenv
from sqlalchemy import create_engine, MetaData
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import sessionmaker

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL)

metadata = MetaData()
metadata.reflect(bind=engine)

Base = automap_base(metadata=metadata)
Base.prepare()

# Main tables (Prisma uses quoted PascalCase names)
User = Base.classes.User
Community = Base.classes.Community
Tag = Base.classes.Tag
Membership = Base.classes.Membership
Interaction = Base.classes.Interaction
Recommendation = Base.classes.Recommendation

# Prisma implicit many-to-many junction tables
# _CommunityTags: A = Community.id, B = Tag.id
# _UserInterests: A = Tag.id, B = User.id
community_tags = metadata.tables["_CommunityTags"]
user_interests = metadata.tables["_UserInterests"]

Session = sessionmaker(bind=engine)

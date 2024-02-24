from sqlalchemy import Boolean,Column,Integer,String
from database import Base

class Todo(Base):
    __tablename__ = "todo"

    id = Column(Integer,primary_key=True,autoincrement=True)
    userid = Column(Integer)
    note = Column(String(100),nullable=False)
    

   

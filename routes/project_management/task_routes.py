from os import name
from fastapi import APIRouter, Request, Depends, HTTPException, Form, status
from sqlalchemy.orm import Session
from schemas.project_management.task_schema import ShowTask
from models.project_management.task_model import Task
from models.project_management.history_model import ProjectHistory
from database import get_db
from datatables import DataTable
from models.project_management.project_model import Project
from models.asset_management.user_model import User
from models.Admin.employeeModel import Employees
from datetime import datetime as dt
from controllers.token_controller import get_token
from typing import List

router = APIRouter(
    prefix='/task',
    tags=['tasks'],
    # dependencies=[Depends(get_token)]
)

# TASK DATATABLE
@router.get('/datatable')
async def datatable(request: Request, db: Session = Depends(get_db)):
    try:
        table = DataTable(dict(request.query_params), Task, db.query(Task), [
            'id',
            'title',
            'body'
        ])
    
        return table.json()
    except Exception as e:
        print(e)

# GET ALL TASKS
@router.get('/', status_code=status.HTTP_200_OK, response_model=List[ShowTask])
async def all_tasks(db: Session = Depends(get_db)):
    data = db.query(Task).filter(Task.active_status == "Active").all()
    return data

# GET ALL SPECIFIC STATUS TASKS
@router.get('/status/{status}', status_code=status.HTTP_200_OK, response_model=List[ShowTask])
async def all_specific_status_tasks(status: str, db: Session = Depends(get_db)):
    data = db.query(Task).filter(Task.active_status == "Active", Task.status == status).all()
    return data

# GET ALL PROJECT TASKS
@router.get('/project/{project_id}', status_code=status.HTTP_200_OK, response_model=List[ShowTask])
async def all_project_tasks(project_id: str, db: Session = Depends(get_db)):
    data = db.query(Task).filter(Task.active_status == "Active", Task.project_id == project_id).all()
    return data

# GET ALL PROJECT SPECIFIC TASKS
@router.get('/project/status/{status}/{project_id}', status_code=status.HTTP_200_OK, response_model=List[ShowTask])
async def all_project_specific_status_tasks(project_id: str, status: str, db: Session = Depends(get_db)):
    data = db.query(Task).filter(Task.active_status == "Active", Task.status == status, Task.project_id == project_id).all()
    return data

# GET ALL DEPARTMENT TASKS
@router.get('/department/{id}', status_code=status.HTTP_200_OK, response_model=List[ShowTask])
async def all_department_tasks(id: str, db: Session = Depends(get_db)):
    employee = db.query(Employees).filter(Employees.user_id == id).first()
    project = db.query(Project).filter(Project.department_id == employee.department_id, Project.active_status == "Active").all()
    tasks = []
    for i in range(len(project)):
        data = db.query(Task).filter(Task.active_status == "Active", Task.project_id == project[i].id).all()
        tasks.extend(data)
    return tasks

# GET ALL DEPARTMENT PROJECT OFFICER TASKS
@router.get('/department/project_officer/{id}', status_code=status.HTTP_200_OK, response_model=List[ShowTask])
async def all_department_project_officer_tasks(id: str, db: Session = Depends(get_db)):
    employee = db.query(Employees).filter(Employees.user_id == id).first()
    project = db.query(Project).filter(Project.manager_id == employee.employee_id, Project.active_status == "Active").all()
    tasks = []
    for i in range(len(project)):
        data = db.query(Task).filter(Task.active_status == "Active", Task.project_id == project[i].id).all()
        tasks.extend(data)
    return tasks

# GET ALL DEPARTMENT SPECIFIC STATUS TASKS
@router.get('/department/status/{status}/{id}', status_code=status.HTTP_200_OK, response_model=List[ShowTask])
async def all_department_specific_status_tasks(id: str, status: str, db: Session = Depends(get_db)):
    employee = db.query(Employees).filter(Employees.user_id == id).first()
    project = db.query(Project).filter(Project.department_id == employee.department_id, Project.active_status == "Active").all()
    tasks = []
    for i in range(len(project)):
        data = db.query(Task).filter(Task.active_status == "Active", Task.status == status, Task.project_id == project[i].id).all()
        tasks.extend(data)
    return tasks

# GET ALL DEPARTMENT PROJECT OFFICER SPECIFIC STATUS TASKS
@router.get('/department/status/project_officer/{status}/{id}', status_code=status.HTTP_200_OK, response_model=List[ShowTask])
async def all_department_project_officer_specific_status_tasks(id: str, status: str, db: Session = Depends(get_db)):
    employee = db.query(Employees).filter(Employees.user_id == id).first()
    project = db.query(Project).filter(Project.manager_id == employee.employee_id, Project.active_status == "Active").all()
    tasks = []
    for i in range(len(project)):
        data = db.query(Task).filter(Task.active_status == "Active", Task.status == status, Task.project_id == project[i].id).all()
        tasks.extend(data)
    return tasks

# GET ALL DEPARTMENT NOTIFICATION
@router.get('/department/notification/{notification}', status_code=status.HTTP_200_OK, response_model=List[ShowTask])
async def all_department_notification_projects(notification: str, db: Session = Depends(get_db), current_user: User = Depends(get_token)):
    users = db.query(User).filter(User.email == current_user).first()
    employee = db.query(Employees).filter(Employees.user_id == users.id).first()
    project = db.query(Project).filter(Project.manager_id == employee.id, Project.active_status == "Active").all()
    tasks = []
    for i in range(len(project)):
        data = db.query(Task).filter(Task.active_status == "Active", Task.project_id == project[i].id, Task.notification == notification).all()
        tasks.extend(data)
    return tasks

# GET ALL DELETED TASKS
@router.get('/deleted', status_code=status.HTTP_200_OK, response_model=List[ShowTask])
async def all_tasks(db: Session = Depends(get_db)):
    data = db.query(Task).filter(Task.active_status == "Inactive").all()
    return data

# GET ONE TASK
@router.get('/{id}', status_code=status.HTTP_200_OK, response_model=ShowTask)
async def get_one_task(id: str, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == id).first()
    if not task:
        raise HTTPException(404, 'Task not found')
    return task

# CREATE TASK
@router.post('/', status_code=status.HTTP_201_CREATED)
async def create_task(name: str = Form(...), description: str = Form(...), project_id: str = Form(...), employee_id: str = Form(...), deadline: str = Form(...), priority: str = Form(...), db: Session = Depends(get_db)):
    try:
        task = Task(
            name = name,
            priority = priority,
            description = description,
            deadline = deadline,
            project_id = project_id,
            employee_id = employee_id,
        )

        db.add(task)
        db.commit()

        project = db.query(Project).filter(Project.id == task.project_id).first()
        history = ProjectHistory(
            project_id = project.id,
            employee_id = project.manager_id,
            subject = 'Added',
            remarks = 'Task: '+task.name+' has been added.',
        )
        db.add(history)
        db.commit()
        return {'message': 'Task stored successfully.'}
    except Exception as e:
        print(e)

# UPDATE TASK
@router.put('/{id}', status_code=status.HTTP_202_ACCEPTED)
async def update_task(id: str, name: str = Form(...), description: str = Form(...), progress_status: str = Form(...), project_id: str = Form(...), employee_id: str = Form(...), deadline: str = Form(...), status: str = Form(...), priority: str = Form(...), db: Session = Depends(get_db)): 
    try:
        if not db.query(Task).filter(Task.id == id).update({
            'project_id' : project_id,
            'employee_id': employee_id,
            'name': name,
            'priority': priority,
            'description': description,
            'deadline': deadline,
            'status' : status,
            'progress_status' : progress_status,
            'updated_at' : dt.utcnow()
        }):
            raise HTTPException(404, 'Task to update is not found')
        db.commit()

        project = db.query(Project).filter(Project.id == project_id).first()
        if progress_status == 'On Progress':
            history = ProjectHistory(
                project_id = project.id,
                employee_id = project.manager_id,
                subject = 'On Progress',
                remarks = 'Task: '+name+' is now on progress.',
            )
            db.add(history)
            db.commit()
        else:
            history = ProjectHistory(
                project_id = project.id,
                employee_id = project.manager_id,
                subject = 'Updated',
                remarks = 'Task: '+name+' has been updated.',
            )
            db.add(history)
            db.commit()

        return {'message': 'Task updated successfully.'}
    except Exception as e:
        print(e)

# MARK AS COMPLETED TASK
@router.put('/mark_completed/{id}', status_code=status.HTTP_202_ACCEPTED)
async def mark_completed_task(id: str, project_id: str = Form(...), db: Session = Depends(get_db)): 
    try:
        if not db.query(Task).filter(Task.id == id).update({
            'project_id' : project_id,
            'progress_status': 'Done',
            'updated_at' : dt.utcnow()
        }):
            raise HTTPException(404, 'Task to update is not found')
        db.commit()

        project = db.query(Project).filter(Project.id == project_id).first()
        task = db.query(Task).filter(Task.id == id).first()
        history = ProjectHistory(
            project_id = project.id,
            employee_id = project.manager_id,
            subject = 'Done',
            remarks = 'Task: '+task.name+' has been completed.',
        )
        db.add(history)
        db.commit()

        return {'message': 'Task updated successfully.'}
    except Exception as e:
        print(e)

@router.put('/auto_update/{id}', status_code=status.HTTP_202_ACCEPTED)
async def update_at_risk_task(id: str, progress_status: str = Form(...), db: Session = Depends(get_db)): 
    try:
        if not db.query(Task).filter(Task.id == id).update({
            'progress_status' : progress_status,
            'notification' : 'At Risk',
            'updated_at' : dt.utcnow()
        }):
            raise HTTPException(404, 'Task to update is not found')
        db.commit()

        task = db.query(Task).filter(Task.id == id).first()
        history = ProjectHistory(
            project_id = task.project_id,
            subject = 'At Risk',
            remarks = 'Task: '+task.name+' is on at risk',
        )
        db.add(history)
        db.commit()

        return {'message': 'Task updated successfully.'}
    except Exception as e:
        print(e)

# RESTORE TASK
@router.put('/restore/{id}', status_code=status.HTTP_202_ACCEPTED)
async def restore_task(id: str, db: Session = Depends(get_db)): 
    if not db.query(Task).filter(Task.id == id).update({
        'active_status' : 'Active',
        'updated_at' : dt.utcnow()
    }):
        raise HTTPException(404, 'Task to restore is not found')
    db.commit()
    return {'message': 'Task restore successfully.'}

# ADD TASK REMARKS
@router.put('/remarks/{id}', status_code=status.HTTP_202_ACCEPTED)
async def add_remarks(id: str, remarks: str = Form(...), db: Session = Depends(get_db)): 
    if not db.query(Task).filter(Task.id == id).update({
        'remarks': remarks,
        'notification': 'Remarks',
        'updated_at' : dt.utcnow()
    }):
        raise HTTPException(404, 'Task remarks to update is not found')
    db.commit()
    return {'message': 'Task remarks updated successfully.'}

# REMOVE NOTIFICATION
@router.put('/notification/{id}', status_code=status.HTTP_202_ACCEPTED)
async def remove_notification(id:str, db: Session = Depends(get_db)): 
    if not db.query(Task).filter(Task.id == id).update({
        'notification' : "",
        'updated_at' : dt.utcnow()
    }):
        raise HTTPException(404, 'Task Notification to remove is not found')
    db.commit()
    return {'message': 'Task Notification removed successfully.'}

# DELETE TASK
@router.delete('/{id}', status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(id: str, db: Session = Depends(get_db)):
    if not db.query(Task).filter(Task.id == id).update({
        'active_status': "Inactive"
    }):
        raise HTTPException(404, 'Task to delete is not found')
    db.commit()
    return {'message': 'Task deleted successfully.'}



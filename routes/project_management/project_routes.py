from os import name
from fastapi import APIRouter, Request, Depends, HTTPException, Form, background, status, BackgroundTasks
from sqlalchemy.orm import Session, joinedload
from schemas.project_management.project_schema import ShowProject
from models.asset_management.user_model import User
from models.Admin.employeeModel import Employees
from models.project_management.project_model import Project
from models.project_management.history_model import ProjectHistory
from database import get_db
from datetime import datetime as dt
from typing import List, Optional
from controllers.token_controller import get_token

router = APIRouter(
    prefix='/projects',
    tags=['projects'],
    # dependencies=[Depends(get_token)]
)

# GET ALL PROJECTS
@router.get('/', status_code=status.HTTP_200_OK, response_model=List[ShowProject])
async def all_projects(db: Session = Depends(get_db)):
    data = db.query(Project).filter(Project.active_status == "Active", Project.approval_status != "Cancelled").all()
    return data

# GET ALL SPECIFIC APPROVAL STATUS PROJECTS
@router.get('/approval_status/{approval_status}', status_code=status.HTTP_200_OK, response_model=List[ShowProject])
async def all_specific_approval_status_projects(approval_status: str, db: Session = Depends(get_db)):
    data = db.query(Project).filter(Project.active_status == "Active", Project.approval_status == approval_status).all()
    return data

# GET ALL SPECIFIC PROGRESS STATUS PROJECTS
@router.get('/progress_status/{progress_status}', status_code=status.HTTP_200_OK, response_model=List[ShowProject])
async def all_specific_progress_status_projects(progress_status: str, db: Session = Depends(get_db)):
    data = db.query(Project).filter(Project.active_status == "Active", Project.approval_status =="Approved", Project.progress_status == progress_status).all()
    return data

# GET ALL DEPARTMENT SPECIFIC APPROVAL STATUS PROJECTS
@router.get('/department/approval_status/{approval_status}/{id}', status_code=status.HTTP_200_OK, response_model=List[ShowProject])
async def all_department_specific_approval_status_projects(id: str, approval_status: str, db: Session = Depends(get_db)):
    employee = db.query(Employees).filter(Employees.user_id == id).first()
    data = db.query(Project).filter(Project.department_id == employee.department_id, Project.active_status == "Active", Project.approval_status == approval_status).all()
    return data

# GET ALL DEPARTMENT PROJECT OFFICER SPECIFIC APPROVAL STATUS PROJECTS
@router.get('/department/approval_status/project_officer/{approval_status}/{id}', status_code=status.HTTP_200_OK, response_model=List[ShowProject])
async def all_department_project_officer_specific_approval_status_projects(id: str, approval_status: str, db: Session = Depends(get_db)):
    employee = db.query(Employees).filter(Employees.user_id == id).first()
    data = db.query(Project).filter(Project.manager_id == employee.employee_id, Project.active_status == "Active", Project.approval_status == approval_status).all()
    return data

# GET ALL DEPARTMENT PROJECTS
@router.get('/department/{id}', status_code=status.HTTP_200_OK, response_model=List[ShowProject])
async def all_department_project(id: str, db: Session = Depends(get_db)):
    employee = db.query(Employees).filter(Employees.user_id == id).first()
    data = db.query(Project).filter(Project.department_id == employee.department_id, Project.active_status == "Active").all()
    return data

# GET ALL DEPARTMENT PROJECT OFFICER PROJECTS
@router.get('/department/project_officer/{id}', status_code=status.HTTP_200_OK, response_model=List[ShowProject])
async def all_department_project_officer_project(id: str, db: Session = Depends(get_db)):
    employee = db.query(Employees).filter(Employees.user_id == id).first()
    data = db.query(Project).filter(Project.manager_id == employee.employee_id, Project.active_status == "Active").all()
    return data

# GET ALL DEPARTMENT SPECIFIC PROGRESS STATUS PROJECTS
@router.get('/department/progress_status/{progress_status}/{id}', status_code=status.HTTP_200_OK, response_model=List[ShowProject])
async def all_department_specific_progress_status_project(id: str, progress_status: str, db: Session = Depends(get_db)):
    employee = db.query(Employees).filter(Employees.user_id == id).first()
    data = db.query(Project).filter(Project.department_id == employee.department_id, Project.active_status == "Active", Project.approval_status == "Approved", Project.progress_status == progress_status).all()
    return data

# GET ALL DEPARTMENT PROJECT OFFICER SPECIFIC PROGRESS STATUS PROJECTS
@router.get('/department/progress_status/project_officer/{progress_status}/{id}', status_code=status.HTTP_200_OK, response_model=List[ShowProject])
async def all_department_project_officer_specific_progress_status_project(id: str, progress_status: str, db: Session = Depends(get_db)):
    employee = db.query(Employees).filter(Employees.user_id == id).first()
    data = db.query(Project).filter(Project.manager_id == employee.employee_id, Project.active_status == "Active", Project.approval_status == "Approved", Project.progress_status == progress_status).all()
    return data

# GET ALL DELETED PROJECTS
@router.get('/deleted', status_code=status.HTTP_200_OK, response_model=List[ShowProject])
async def all_deleted_projects(db: Session = Depends(get_db)):
    data = db.query(Project).filter(Project.active_status == "Inactive").all()
    return data

# GET ALL NOTIFICATION
@router.get('/notification/{notification}', status_code=status.HTTP_200_OK, response_model=List[ShowProject])
async def all_notification_projects(notification: str, db: Session = Depends(get_db)):
    data = db.query(Project).filter(Project.active_status == "Active", Project.notification == notification).all()
    return data

# GET ALL DEPARTMENT NOTIFICATION
@router.get('/department/notification/{notification}', status_code=status.HTTP_200_OK, response_model=List[ShowProject])
async def all_department_notification_projects(notification: str, db: Session = Depends(get_db), current_user: User = Depends(get_token)):
    users = db.query(User).filter(User.user_email == current_user.user_email).first()
    employee = db.query(Employees).filter(Employees.user_id == users.id).first()
    data = db.query(Project).filter(Project.active_status == "Active", Project.manager_id == employee.id, Project.notification == notification).all()
    return data

# GET ONE PROJECT
@router.get('/{id}', status_code=status.HTTP_200_OK, response_model=ShowProject)
async def get_one_project(id: str, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == id).first()
    if not project:
        raise HTTPException(404, 'Project not found')
    return project

# DEPARTMENT PROJECT REQUEST
@router.post('/department/{department_id}/{manager_id}', status_code=status.HTTP_201_CREATED)
async def request_project(department_id: str, manager_id: str, name: str = Form(...), background: str = Form(...), coverage: str = Form(...), assumptions: str = Form(...), constraints: str = Form(...), target_beneficiaries: str = Form(...), objectives: str = Form(...), expected_output: str = Form(...), cost: int = Form(...), type: str = Form(...), start_date: str = Form(...), end_date: str = Form(...), concept_paper_id: Optional[str] = Form(None), db: Session = Depends(get_db)):
    try:
        project = Project(
            department_id = department_id,
            manager_id = manager_id,
            name = name,
            background = background,
            coverage = coverage,
            assumptions = assumptions,
            constraints = constraints,
            target_beneficiaries = target_beneficiaries,
            objectives = objectives,
            expected_output = expected_output,
            type = type,
            cost = cost,
            start_date = start_date,
            end_date = end_date,
            concept_paper_id = concept_paper_id,
            notification = 'Request'
        )
        db.add(project)
        db.commit()

        history = ProjectHistory(
            project_id = project.id,
            employee_id = project.manager_id,
            subject = 'Requested',
            remarks = 'Project: '+project.name+' has been requested by '+project.project_user.employee_first_name+' '+project.project_user.employee_last_name,
        )
        db.add(history)
        db.commit()

        project = db.query(Project).filter(Project.id == project.id).first()

        return {"data": project,
                'message': 'Project stored successfully.'}
    except Exception as e:
        print(e)

# CREATE PROJECT
@router.post('/create_project', status_code=status.HTTP_201_CREATED)
async def create_project(name: str = Form(...), background: str = Form(...), coverage: str = Form(...), assumptions: str = Form(...), constraints: str = Form(...), target_beneficiaries: str = Form(...), objectives: str = Form(...), expected_output: str = Form(...), cost: float = Form(...), type: str = Form(...), start_date: str = Form(...), end_date: str = Form(...), manager_id: str = Form(...), department_id: str = Form(...), db: Session = Depends(get_db)):
    try:
        project = Project(
            name = name,
            background = background,
            coverage = coverage,
            assumptions = assumptions,
            constraints = constraints,
            target_beneficiaries = target_beneficiaries,
            objectives = objectives,
            expected_output = expected_output,
            type = type,
            cost = cost,
            start_date = start_date,
            end_date = end_date,
            manager_id = manager_id,
            department_id = department_id,
            approval_status = "Approved",
            progress_status = "On Hold",
            notification = 'Appoint'
        )
        db.add(project)
        db.commit()

        history = ProjectHistory(
            project_id = project.id,
            employee_id = project.manager_id,
            subject = 'Assigned',
            remarks = 'Project: '+project.name+' has been assigned to '+project.project_user.employee_first_name+' '+project.project_user.employee_last_name,
        )
        db.add(history)
        db.commit()

        project = db.query(Project).filter(Project.id == project.id).first()

        return {"data": project,
                'message': 'Project stored successfully.'
            }
    except Exception as e:
        print(e)

# REJECT PROJECT
@router.put('/reject/{id}', status_code=status.HTTP_202_ACCEPTED)
async def reject_project(id: str, remarks: str = Form(...), db: Session = Depends(get_db)): 
    try:
        if not db.query(Project).filter(Project.id == id).update({
            'approval_status' : "Rejected",
            'remarks' : remarks,
            'notification' : "Rejected",
            'updated_at' : dt.utcnow()
        }):
            raise HTTPException(404, 'Project to reject is not found')
        db.commit()

        project = db.query(Project).filter(Project.id == id).first()
        history = ProjectHistory(
            project_id = project.id,
            employee_id = project.manager_id,
            subject = 'Rejected',
            remarks = 'Project: '+project.name+' has been rejected by Department Head.',
        )
        db.add(history)
        db.commit()

        return {'message': 'Project rejected successfully.'}
    except Exception as e:
        print(e)

# APPROVE PROJECT
@router.put('/approve/{id}', status_code=status.HTTP_202_ACCEPTED)
async def approve_project(id: str, background_tasks: BackgroundTasks, db: Session = Depends(get_db)): 
    try:
        if not db.query(Project).filter(Project.id == id).update({
            'approval_status' : "Approved",
            'progress_status' : "On Progress",
            'notification' : "Approved",
            'updated_at' : dt.utcnow()
        }):
            raise HTTPException(404, 'Project to approve is not found')
        # send_email_background(background_tasks, 'Homis Project Request', 'jeffersonborjal019@gmail.com')
        db.commit()

        project = db.query(Project).filter(Project.id == id).first()
        history = ProjectHistory(
            project_id = project.id,
            employee_id = project.manager_id,
            subject = 'Approved',
            remarks = 'Project: '+project.name+' has been approved by Department Head.',
        )
        db.add(history)
        db.commit()

        return {'message': 'Project approved successfully.'}
    except Exception as e:
        print(e)

# ACCEPT PROJECT
@router.put('/accept/{id}', status_code=status.HTTP_202_ACCEPTED)
async def accept_project(id: str, db: Session = Depends(get_db)):
    try: 
        if not db.query(Project).filter(Project.id == id).update({
            'progress_status' : "On Progress",
            'notification' : "Accept",
            'updated_at' : dt.utcnow()
        }):
            raise HTTPException(404, 'Project to accept is not found')
        db.commit()

        project = db.query(Project).filter(Project.id == id).first()
        history = ProjectHistory(
            project_id = project.id,
            employee_id = project.manager_id,
            subject = 'Accepted',
            remarks = 'Project: '+project.name+' has been accepted by '+project.project_user.first_name+' '+project.project_user.last_name,
        )
        db.add(history)
        db.commit()

        return {'message': 'Project accepted successfully.'}
    except Exception as e:
        print(e)

# REFUSE PROJECT
@router.put('/refuse/{id}', status_code=status.HTTP_202_ACCEPTED)
async def refuse_project(id: str, remarks: str = Form(...), db: Session = Depends(get_db)):
    try:
        if not db.query(Project).filter(Project.id == id).update({
            'approval_status' : 'Refused',
            'progress_status' : "On Hold",
            'remarks' : remarks,
            'notification' : "Refused",
            'updated_at' : dt.utcnow()
        }):
            raise HTTPException(404, 'Project to refuse is not found')
        db.commit()

        project = db.query(Project).filter(Project.id == id).first()
        history = ProjectHistory(
            project_id = project.id,
            employee_id = project.manager_id,
            subject = 'Refused',
            remarks = 'Project: '+project.name+' has been refused by '+project.project_user.first_name+' '+project.project_user.last_name,
        )
        db.add(history)
        db.commit()

        return {'message': 'Project refused successfully.'}
    except Exception as e:
        print(e)

# CANCEL PROJECT
@router.put('/cancel/{id}', status_code=status.HTTP_202_ACCEPTED)
async def cancel_project(id: str, remarks: str = Form(...), db: Session = Depends(get_db)): 
    try:
        if not db.query(Project).filter(Project.id == id).update({
            'progress_status' : "Cancelled",
            'remarks' : remarks,
            'notification' : "Cancelled",
            'updated_at' : dt.utcnow()
        }):
            raise HTTPException(404, 'Project to cancel is not found')
        db.commit()

        project = db.query(Project).filter(Project.id == id).first()
        history = ProjectHistory(
            project_id = project.id,
            employee_id = project.manager_id,
            subject = 'Cancelled',
            remarks = 'Project: '+project.name+' has been cancelled by '+project.project_user.first_name+' '+project.project_user.last_name,
        )
        db.add(history)
        db.commit()

        return {'message': 'Project cancelled successfully.'}
    except Exception as e:
        print(e)

# CANCEL PROJECT REQUEST
@router.put('/cancel_request/{id}', status_code=status.HTTP_202_ACCEPTED)
async def cancel_request(id: str, db: Session = Depends(get_db)): 
    if not db.query(Project).filter(Project.id == id).update({
        'approval_status' : "Cancelled",
        'updated_at' : dt.utcnow()
    }):
        raise HTTPException(404, 'Project to cancel is not found')
    db.commit()
    return {'message': 'Project cancelled successfully.'}

# UPDATE PROJECT
@router.put('/{id}', status_code=status.HTTP_202_ACCEPTED)
async def update_project(id: str, name: str = Form(...), background: str = Form(...), coverage: str = Form(...), assumptions: str = Form(...), constraints: str = Form(...), target_beneficiaries: str = Form(...), objectives: str = Form(...), expected_output: str = Form(...), cost: float = Form(...), type: str = Form(...), start_date: str = Form(...), end_date: str = Form(...), manager_id: str = Form(...), department_id: str = Form(...), concept_paper_id: Optional[str] = Form(None), db: Session = Depends(get_db)): 
    try:
        if not db.query(Project).filter(Project.id == id).update({
            'name': name,
            'background': background,
            'coverage': coverage,
            'assumptions': assumptions,
            'constraints': constraints,
            'objectives': objectives,
            'target_beneficiaries': target_beneficiaries,
            'expected_output': expected_output,
            'type': type,
            'cost': cost,
            'start_date' : start_date,
            'end_date' : end_date,
            'manager_id' : manager_id,
            'department_id' : department_id,
            'concept_paper_id' : concept_paper_id,
            'notification' : 'Update',
            'updated_at' : dt.utcnow()
        }):
            raise HTTPException(404, 'Project to update is not found')
        db.commit()

        project = db.query(Project).filter(Project.id == id).first()
        history = ProjectHistory(
            project_id = project.id,
            employee_id = project.manager_id,
            subject = 'Updated',
            remarks = 'Project: '+project.name+' has been updated by Department Head',
        )
        db.add(history)
        db.commit()

        return {'message': 'Project updated successfully.'}
    except Exception as e:
        print(e)

# MARK AS COMPLETED PROJECT
@router.put('/mark_completed/{id}', status_code=status.HTTP_202_ACCEPTED)
async def mark_completed_project(id: str, db: Session = Depends(get_db)): 
    try:
        if not db.query(Project).filter(Project.id == id).update({
            'progress_status' : 'Completed',
            'updated_at' : dt.utcnow()
        }):
            raise HTTPException(404, 'Project to update is not found')
        db.commit()

        project = db.query(Project).filter(Project.id == id).first()
        history = ProjectHistory(
            project_id = project.id,
            employee_id = project.manager_id,
            subject = 'Completed',
            remarks = 'Project: '+project.name+' has been completed.',
        )
        db.add(history)
        db.commit()

        return {'message': 'Project updated successfully.'}
    except Exception as e:
        print(e)

# SCHEDULE PROJECT
@router.put('/schedule/{id}', status_code=status.HTTP_202_ACCEPTED)
async def schedule_project(id: str, start_date: str = Form(...), end_date: str = Form(...), db: Session = Depends(get_db)): 
    try:
        if not db.query(Project).filter(Project.id == id).update({
            'start_date' : start_date,
            'end_date' : end_date,
            'notification' : 'Reschedule',
            'updated_at' : dt.utcnow()
        }):
            raise HTTPException(404, 'Project to schedule is not found')
        db.commit()

        project = db.query(Project).filter(Project.id == id).first()
        history = ProjectHistory(
            project_id = project.id,
            employee_id = project.manager_id,
            subject = 'Rescheduled',
            remarks = 'Project: '+project.name+' has been rescheduled by Department Head',
        )
        db.add(history)
        db.commit()

        return {'message': 'Project scheduled successfully.'}
    except Exception as e:
        print(e)

# REMOVE NOTIFICATION
@router.put('/notification/{id}', status_code=status.HTTP_202_ACCEPTED)
async def remove_notification(id:str, db: Session = Depends(get_db)): 
    if not db.query(Project).filter(Project.id == id).update({
        'notification' : "",
        'updated_at' : dt.utcnow()
    }):
        raise HTTPException(404, 'Project Notification to remove is not found')
    db.commit()
    return {'message': 'Project Notification removed successfully.'}

# AUTO UPDATE DELAYED PROJECT
@router.put('/auto_update/{id}', status_code=status.HTTP_202_ACCEPTED)
async def update_delayed_project(id: str, progress_status: str = Form(...), db: Session = Depends(get_db)): 
    try:
        if not db.query(Project).filter(Project.id == id).update({
            'progress_status' : progress_status,
            'notification' : 'Delayed',
            'updated_at' : dt.utcnow()
        }):
            raise HTTPException(404, 'Project to update is not found')
        db.commit()

        project = db.query(Project).filter(Project.id == id).first()
        history = ProjectHistory(
            project_id = project.id,
            employee_id = project.manager_id,
            subject = 'Delayed',
            remarks = 'Project: '+project.name+' has been delayed',
        )
        db.add(history)
        db.commit()

        return {'message': 'Project updated successfully.'}
    except Exception as e:
        print(e)

# RESTORE PROJECT
@router.put('/restore/{id}', status_code=status.HTTP_202_ACCEPTED)
async def restore_project(id: str, db: Session = Depends(get_db)): 
    if not db.query(Project).filter(Project.id == id).update({
        'active_status' : "Active",
        'updated_at' : dt.utcnow()
    }):
        raise HTTPException(404, 'Project to restore is not found')
    db.commit()
    return {'message': 'Project restored successfully.'}

# ADD PROJECT REMARKS
@router.put('/remarks/{id}', status_code=status.HTTP_202_ACCEPTED)
async def add_remarks(id: str, remarks: str = Form(...), db: Session = Depends(get_db)): 
    if not db.query(Project).filter(Project.id == id).update({
        'remarks': remarks,
        'notification' : 'Remarks',
        'updated_at' : dt.utcnow()
    }):
        raise HTTPException(404, 'Project remarks to update is not found')
    db.commit()
    return {'message': 'Project remarks updated successfully.'}

# DELETE PROJECT
@router.delete('/{id}', status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(id: str, db: Session = Depends(get_db)):
    if not db.query(Project).filter(Project.id == id).update({
        'active_status': "Inactive"
    }):
        raise HTTPException(404, 'Project to delete is not found')
    db.commit()
    return {'message': 'Project deleted successfully.'}



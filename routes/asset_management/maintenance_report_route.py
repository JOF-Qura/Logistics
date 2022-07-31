  
from fastapi import APIRouter, Depends, HTTPException, Cookie
from sqlalchemy.orm import Session
from sqlalchemy.orm import load_only
from schemas.asset_management.maintenance_report_schema import CreateReport
from models.asset_management.maintenance_report_model import Maintenance_Report
from database import get_db
from datetime import date
from dateutil.relativedelta import *
# from dependencies import get_token


router = APIRouter(
    prefix='/asset_management/api/Maintenance_report',
    tags=['Maintenance_report'],
    # dependencies=[Depends(get_token)]
)

@router.get('/dashboard/yearly_cost')
def read(db: Session = Depends(get_db)):
    jan = db.query(Maintenance_Report.maintenance_cost).filter(Maintenance_Report.completed_date.between(str(date.today().year) + "-1-1", str(date.today().year) + "-1-31")).all()
    feb = db.query(Maintenance_Report.maintenance_cost).filter(Maintenance_Report.completed_date.between(str(date.today().year) + "-2-1", str(date.today().year) + "-3-1")).all()
    mar = db.query(Maintenance_Report.maintenance_cost).filter(Maintenance_Report.completed_date.between(str(date.today().year) + "-3-2", str(date.today().year) + "-3-31")).all()
    apr = db.query(Maintenance_Report.maintenance_cost).filter(Maintenance_Report.completed_date.between(str(date.today().year) + "-4-1", str(date.today().year) + "-4-31")).all()
    may = db.query(Maintenance_Report.maintenance_cost).filter(Maintenance_Report.completed_date.between(str(date.today().year) + "-5-1", str(date.today().year) + "-5-31")).all()
    jun = db.query(Maintenance_Report.maintenance_cost).filter(Maintenance_Report.completed_date.between(str(date.today().year) + "-6-1", str(date.today().year) + "-6-31")).all()
    jul = db.query(Maintenance_Report.maintenance_cost).filter(Maintenance_Report.completed_date.between(str(date.today().year) + "-7-1", str(date.today().year) + "-7-31")).all()
    aug = db.query(Maintenance_Report.maintenance_cost).filter(Maintenance_Report.completed_date.between(str(date.today().year) + "-8-1", str(date.today().year) + "-8-31")).all()
    sep = db.query(Maintenance_Report.maintenance_cost).filter(Maintenance_Report.completed_date.between(str(date.today().year) + "-9-1", str(date.today().year) + "-9-31")).all()
    oct = db.query(Maintenance_Report.maintenance_cost).filter(Maintenance_Report.completed_date.between(str(date.today().year) + "-10-1", str(date.today().year) + "-10-31")).all()
    nov = db.query(Maintenance_Report.maintenance_cost).filter(Maintenance_Report.completed_date.between(str(date.today().year) + "-11-1", str(date.today().year) + "-11-31")).all()
    dec = db.query(Maintenance_Report.maintenance_cost).filter(Maintenance_Report.completed_date.between(str(date.today().year) + "-12-1", str(date.today().year) + "-12-31")).all()
    
    last_jan = db.query(Maintenance_Report.maintenance_cost).filter(Maintenance_Report.completed_date.between(str(date.today().year - 1) + "-1-1", str(date.today().year - 1) + "-1-31")).all()
    last_feb = db.query(Maintenance_Report.maintenance_cost).filter(Maintenance_Report.completed_date.between(str(date.today().year - 1) + "-2-1", str(date.today().year - 1) + "-3-1")).all()
    last_mar = db.query(Maintenance_Report.maintenance_cost).filter(Maintenance_Report.completed_date.between(str(date.today().year - 1) + "-3-2", str(date.today().year - 1) + "-3-31")).all()
    last_apr = db.query(Maintenance_Report.maintenance_cost).filter(Maintenance_Report.completed_date.between(str(date.today().year - 1) + "-4-1", str(date.today().year - 1) + "-4-31")).all()
    last_may = db.query(Maintenance_Report.maintenance_cost).filter(Maintenance_Report.completed_date.between(str(date.today().year - 1) + "-5-1", str(date.today().year - 1) + "-5-31")).all()
    last_jun = db.query(Maintenance_Report.maintenance_cost).filter(Maintenance_Report.completed_date.between(str(date.today().year - 1) + "-6-1", str(date.today().year - 1) + "-6-31")).all()
    last_jul = db.query(Maintenance_Report.maintenance_cost).filter(Maintenance_Report.completed_date.between(str(date.today().year - 1) + "-7-1", str(date.today().year - 1) + "-7-31")).all()
    last_aug = db.query(Maintenance_Report.maintenance_cost).filter(Maintenance_Report.completed_date.between(str(date.today().year - 1) + "-8-1", str(date.today().year - 1) + "-8-31")).all()
    last_sep = db.query(Maintenance_Report.maintenance_cost).filter(Maintenance_Report.completed_date.between(str(date.today().year - 1) + "-9-1", str(date.today().year - 1) + "-9-31")).all()
    last_oct = db.query(Maintenance_Report.maintenance_cost).filter(Maintenance_Report.completed_date.between(str(date.today().year - 1) + "-10-1", str(date.today().year - 1) + "-10-31")).all()
    last_nov = db.query(Maintenance_Report.maintenance_cost).filter(Maintenance_Report.completed_date.between(str(date.today().year - 1) + "-11-1", str(date.today().year - 1) + "-11-31")).all()
    last_dec = db.query(Maintenance_Report.maintenance_cost).filter(Maintenance_Report.completed_date.between(str(date.today().year - 1) + "-12-1", str(date.today().year - 1) + "-12-31")).all()
    return {'jan': jan,'feb': feb,'mar': mar,
            'apr': apr,'may': may,'jun': jun,
            'jul': jul,'aug': aug,'sep': sep,
            'oct': oct,'nov': nov,'dec': dec,
            'last_jan': last_jan,'last_feb': last_feb,'last_mar': last_mar,
            'last_apr': last_apr,'last_may': last_may,'last_jun': last_jun,
            'last_jul': last_jul,'last_aug': last_aug,'last_sep': last_sep,
            'last_oct': last_oct,'last_nov': last_nov,'last_dec': last_dec,
            }

@router.get('/dashboard/total_cost')
def read(db: Session = Depends(get_db)):
    report = db.query(Maintenance_Report.maintenance_cost).filter(Maintenance_Report.completed_date.between(date.today()+relativedelta(months=-1), date.today())).all()
    if not report:
        raise HTTPException(404, 'reports not found')
    return {'data': report}

@router.get('/dashboard/yearly_total_cost')
def read(db: Session = Depends(get_db)):
    report = db.query(Maintenance_Report.maintenance_cost).filter(Maintenance_Report.completed_date.between(str(date.today().year) + "-1-1", str(date.today().year) + "-12-31")).all()
    if not report:
        raise HTTPException(404, 'reports not found')
    return {'data': report}

@router.post('/')
def add(report: CreateReport, db: Session = Depends(get_db)):
    try:
        report_details = Maintenance_Report(
            
            maintenance_id = report.maintenance_id,
            maintenance_cost = report.maintenance_cost,
            completed_date = report.completed_date,

        )
        db.add(report_details)
        db.commit()
        return {'message': 'report created successfully.'}
    except Exception as e:
        print(e)
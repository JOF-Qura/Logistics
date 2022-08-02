from datetime import datetime
import email
from fastapi import status, HTTPException
from sqlalchemy.orm import Session

from app.models import employee
from app.models.vendor import Vendor
from .. import database, models
from fastapi import HTTPException, status
from app.security.hashing import Hash

from app.schemas.user import User



# create
def create(request: User, db : Session):#
    
    new_user = models.User(
        email=request.email,
        password=Hash.bycrypt(request.password),
        user_type_id=request.user_type_id,
        vendor_id=request.vendor_id,
        employee_id=request.employee_id,
        )
    if db.query(models.User).filter_by(employee_id = request.employee_id).count() ==1:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
        detail=f"Employee has already have an account")   

    if db.query(models.User).filter_by(vendor_id = request.vendor_id).count() ==1:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
        detail=f"Vendor has already have an account") 

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    try:
        if request.vendor_id != "" or request.vendor_id != "none":
            vendor_info =  db.query(models.Vendor).filter(models.Vendor.id == request.vendor_id).first()
            # send_mail(vendor_info.vendor_name,request.email,request.password)
            send_mail(vendor_info.vendor_name,"balinkian@gmail.com",request.password)
    except Exception as e:
        print(e)
    return new_user


# get all
def get( db : Session ):#
    user = db.query(models.User).all()
    return user

# get one
def get_one(id, db : Session):#
    user = db.query(models.User).filter(models.User.id == id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'User with the id of {id} is not found')

    return user

# get one that equal to vendor id
def get_one_vendor_id(vendor_id, db : Session):#
    user = db.query(models.User).filter(models.User.vendor_id == vendor_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'User with the venndor id of {vendor_id} is not found')

    return user

# update
def update(id:int, request: User, db : Session):#
    user = db.query(models.User).filter(models.User.id == id)
    if not user.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
        detail=f'User with the {id} is not found')
    user.update(
       {
        'email' : request.email,
        'password' : Hash.bycrypt(request.password),
        'employee_id' : request.employee_id,
        'vendor_id' : request.vendor_id,
        'user_type_id': request.user_type_id,
       }
        )
    db.commit()
    return 'User Successfully Updated'


# delete
def delete(id,db : Session ):#
    user = db.query(models.User).filter(models.User.id == id)
    if not user.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
        detail=f'User with the {id} is not found')
    user.delete(synchronize_session=False)
    db.commit()
    return user


 
from dotenv import dotenv_values
credentials = dotenv_values(".env")

# Send Email to Vendor
def send_mail(name, recipient, password):
    import smtplib
    from email.mime.multipart import MIMEMultipart
    from email.mime.text import MIMEText
    from email.utils import formatdate
 

    text = '''
       Here are your credentials. Please change password immediately.
          <html>
            <body style="margin: 0; padding: 0; box-sizing: border-box; font-family: Arial, Helvetica, sans-serif;">
            <div style="width: 100%; background: #efefef; border-radius: 10px; padding: 10px;">
            <div style="margin: 0 auto; width: 90%; text-align: center;">
                <h4>Homies Hospital System</h4><br><br>
                <label><strong>Email/Username</strong></label><br>
                <p>'''+recipient+'''</p>
                 <label><strong>Password</strong></label><br>
                <p> '''+password+''' </p>
            </div>
            </div>
            </body>
            </html> 
            '''
    date = datetime.now()

    #* Load SMTP
    sender = 'HomIES Procurement <noreply@homies.com>'
    receiver = recipient

    message = MIMEMultipart('alternative')
    message['From']    = sender
    message['Subject'] = 'Homies User Account'
    message['To']      = f'{name} <{receiver}>'
    message['Date']    = formatdate()
    message.attach(MIMEText(text.format(name=name,email=receiver,password=password), 'text'))
    message.attach(MIMEText('<!DOCTYPE html><html><body>'+text+'</body></html>', 'html'))

    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.ehlo()
            server.login(credentials['EMAIL'], credentials['PASSWORD'])
            server.sendmail(sender, receiver, message.as_string())
            server.quit()
    except Exception as e:
        print(e)
        

    return message

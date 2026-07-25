# Click Aarambh ClinicOS \- Doctor Schema Database Design

Schema: doctor  
Purpose: Doctor master, profile, scheduling, consultation and administration\.

## Doctors

Field

Suggested Type

id

TBD

clinic\_id

TBD

employee\_id

TBD

doctor\_code

TBD

title

TBD

first\_name

TBD

middle\_name

TBD

last\_name

TBD

gender

TBD

date\_of\_birth

TBD

blood\_group

TBD

mobile\_number

TBD

alternate\_mobile

TBD

email

TBD

profile\_photo

TBD

consultation\_type

TBD

joining\_date

TBD

experience\_years

TBD

status

TBD

remarks

TBD

created\_by

TBD

created\_at

TBD

updated\_by

TBD

updated\_at

TBD

## DoctorQualifications

Field

Suggested Type

id

TBD

doctor\_id

TBD

qualification

TBD

university

TBD

institution

TBD

passing\_year

TBD

specialization

TBD

certificate\_attachment\_id

TBD

remarks

TBD

## DoctorRegistrations

Field

Suggested Type

id

TBD

doctor\_id

TBD

registration\_number

TBD

registration\_council

TBD

registration\_state

TBD

registration\_date

TBD

expiry\_date

TBD

attachment\_id

TBD

verification\_status

TBD

## DoctorSpecializations

Field

Suggested Type

id

TBD

doctor\_id

TBD

specialization\_name

TBD

department\_id

TBD

years\_of\_experience

TBD

primary\_specialization

TBD

remarks

TBD

## DoctorDepartments

Field

Suggested Type

id

TBD

doctor\_id

TBD

department\_id

TBD

designation

TBD

joining\_date

TBD

status

TBD

## DoctorAvailability

Field

Suggested Type

id

TBD

doctor\_id

TBD

day\_of\_week

TBD

start\_time

TBD

end\_time

TBD

slot\_duration

TBD

consultation\_mode

TBD

maximum\_patients

TBD

status

TBD

## DoctorBlockedSlots

Field

Suggested Type

id

TBD

doctor\_id

TBD

block\_date

TBD

start\_time

TBD

end\_time

TBD

reason

TBD

created\_by

TBD

created\_at

TBD

## DoctorLeaves

Field

Suggested Type

id

TBD

doctor\_id

TBD

leave\_type

TBD

start\_date

TBD

end\_date

TBD

reason

TBD

approved\_by

TBD

approval\_status

TBD

remarks

TBD

## DoctorConsultationFees

Field

Suggested Type

id

TBD

doctor\_id

TBD

consultation\_type

TBD

consultation\_fee

TBD

followup\_fee

TBD

emergency\_fee

TBD

teleconsultation\_fee

TBD

effective\_from

TBD

status

TBD

## DoctorDigitalSignature

Field

Suggested Type

id

TBD

doctor\_id

TBD

attachment\_id

TBD

signature\_type

TBD

issue\_date

TBD

expiry\_date

TBD

status

TBD

## DoctorDocuments

Field

Suggested Type

id

TBD

doctor\_id

TBD

attachment\_id

TBD

document\_type

TBD

document\_name

TBD

uploaded\_at

TBD

remarks

TBD

## DoctorPerformance

Field

Suggested Type

id

TBD

doctor\_id

TBD

report\_month

TBD

total\_patients

TBD

completed\_consultations

TBD

followups

TBD

cancelled\_appointments

TBD

average\_consultation\_time

TBD

patient\_rating

TBD

revenue\_generated

TBD

## DoctorNotes

Field

Suggested Type

id

TBD

doctor\_id

TBD

note\_type

TBD

note

TBD

created\_by

TBD

created\_at

TBD

## DoctorAwards

Field

Suggested Type

id

TBD

doctor\_id

TBD

award\_name

TBD

organization

TBD

award\_date

TBD

description

TBD

## DoctorLanguages

Field

Suggested Type

id

TBD

doctor\_id

TBD

language\_name

TBD

proficiency

TBD

## DoctorCommunicationPreferences

Field

Suggested Type

id

TBD

doctor\_id

TBD

sms\_enabled

TBD

email\_enabled

TBD

whatsapp\_enabled

TBD

notification\_enabled

TBD

## DoctorLoginDevices

Field

Suggested Type

id

TBD

doctor\_id

TBD

device\_name

TBD

operating\_system

TBD

browser

TBD

ip\_address

TBD

last\_login

TBD

trusted\_device

TBD

## DoctorAudit

Field

Suggested Type

id

TBD

doctor\_id

TBD

action

TBD

action\_by

TBD

previous\_value

TBD

new\_value

TBD

ip\_address

TBD

action\_time

TBD


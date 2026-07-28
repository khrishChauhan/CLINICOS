# Click Aarambh ClinicOS \- Laboratory Schema Database Design

Schema: laboratory  
Purpose: Manages laboratory orders, sample collection, processing, results, quality control and reporting\.

## LabOrders

Field

Suggested Type

id

TBD

clinic\_id

TBD

patient\_id

TBD

visit\_id

TBD

appointment\_id

TBD

doctor\_id

TBD

order\_number

TBD

order\_date

TBD

priority

TBD

status

TBD

remarks

TBD

created\_by

TBD

created\_at

TBD

## LabOrderItems

Field

Suggested Type

id

TBD

lab\_order\_id

TBD

test\_id

TBD

test\_name

TBD

sample\_type

TBD

status

TBD

remarks

TBD

## LabSamples

Field

Suggested Type

id

TBD

lab\_order\_item\_id

TBD

sample\_barcode

TBD

sample\_type

TBD

collection\_date

TBD

collected\_by

TBD

container\_type

TBD

status

TBD

## SampleCollections

Field

Suggested Type

id

TBD

sample\_id

TBD

collector\_id

TBD

collection\_method

TBD

collection\_site

TBD

collection\_time

TBD

remarks

TBD

## SampleTracking

Field

Suggested Type

id

TBD

sample\_id

TBD

from\_location

TBD

to\_location

TBD

tracked\_by

TBD

tracking\_time

TBD

status

TBD

## LabTests

Field

Suggested Type

id

TBD

lab\_order\_item\_id

TBD

test\_code

TBD

test\_name

TBD

department

TBD

instrument

TBD

status

TBD

## LabResults

Field

Suggested Type

id

TBD

lab\_test\_id

TBD

result\_value

TBD

unit

TBD

reference\_range

TBD

abnormal\_flag

TBD

verified\_by

TBD

verified\_at

TBD

status

TBD

## LabResultParameters

Field

Suggested Type

id

TBD

lab\_result\_id

TBD

parameter\_name

TBD

parameter\_value

TBD

unit

TBD

reference\_range

TBD

abnormal\_flag

TBD

## LabReports

Field

Suggested Type

id

TBD

lab\_order\_id

TBD

report\_number

TBD

generated\_by

TBD

approved\_by

TBD

generated\_at

TBD

report\_status

TBD

attachment\_id

TBD

## LabTechnicians

Field

Suggested Type

id

TBD

employee\_id

TBD

qualification

TBD

registration\_number

TBD

status

TBD

## LabInstruments

Field

Suggested Type

id

TBD

instrument\_code

TBD

instrument\_name

TBD

manufacturer

TBD

model

TBD

serial\_number

TBD

status

TBD

## LabQualityControl

Field

Suggested Type

id

TBD

instrument\_id

TBD

qc\_date

TBD

qc\_type

TBD

performed\_by

TBD

result

TBD

status

TBD

## ReferenceRanges

Field

Suggested Type

id

TBD

test\_id

TBD

gender

TBD

age\_from

TBD

age\_to

TBD

low\_value

TBD

high\_value

TBD

unit

TBD

## SpecimenTypes

Field

Suggested Type

id

TBD

specimen\_code

TBD

specimen\_name

TBD

storage\_requirement

TBD

status

TBD

## LabConsumables

Field

Suggested Type

id

TBD

item\_code

TBD

item\_name

TBD

unit

TBD

minimum\_stock

TBD

status

TBD

## LabAttachments

Field

Suggested Type

id

TBD

lab\_order\_id

TBD

attachment\_id

TBD

document\_type

TBD

uploaded\_at

TBD

## LabNotifications

Field

Suggested Type

id

TBD

lab\_order\_id

TBD

recipient\_type

TBD

notification\_type

TBD

status

TBD

sent\_at

TBD

## LabAudit

Field

Suggested Type

id

TBD

lab\_order\_id

TBD

action

TBD

action\_by

TBD

previous\_value

TBD

new\_value

TBD

action\_time

TBD


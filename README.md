# iDAI2Hypertopic
A connector designed to use an iDAI.field database with Hypertopic.

## Introduction
iDAI.field is a software, developed by the German Archaeological Institute, designed to document archaeological items found during field research. For more information on iDAI.field, please check this repository : https://github.com/dainst/idai-field.
The goal of this project is to find a way to connect Porphyry to iDAI.field, and to use the data stored in an iDAI.field database in Porphyry, using the Hypertopic protocol.

## Configuration

### Replication of the databases
For each project created in iDAI.field, the software create a separate database. This one contains at least one document with the id "project" which is the project document plus one document for each item, image or location.

To let Porphyry read the data of iDAI.field you need to replicate the data in your own CouchDB

## Views
The design document is based on the argos design document. The only differences are for the 2 views Corpus and User :

* the User view is available to the following address: <http://127.0.0.1:5984/[replicationDatabaseName]/_design/[designDocumentID]/_rewrite/user/offrandes>
* the Corpus view is available to the following address : <http://127.0.0.1:5984/[replicationDatabaseName]/_design/[designDocumentID]/_view/corpus>

These two are necesseary to let Prophyry read the iDAI.field's data. The other ones do not have any impact on the software but are also available and follow the same rules as Argos views.

## Challenges

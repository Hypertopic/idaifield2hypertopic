# iDAI2Hypertopic
Map functions designed to use an iDAI.field database with Hypertopic.

## Introduction
iDAI.field is a software, developed by the German Archaeological Institute, designed to document archaeological items found during field research. For more information on iDAI.field, please check this repository : https://github.com/dainst/idai-field.
The goal of this project is to find a way to connect Porphyry to iDAI.field, and to use the data stored in an iDAI.field database in Porphyry, using the Hypertopic protocol.

## Configuration

### Replication of the databases
For each project created in iDAI.field, the software create a separate database. This one contains at least one document with the id "project" which is the project document plus one document for each item, image or location.

To let Porphyry read the data of iDAI.field you need to replicate the data in your own database, so for example with CouchDB. An easy way to proceed the replication is to use the CouchDB interface. In the "Replication" part you need to fill the inputs.

Replication Source: Remote Database / Local Database
Source Name: http(s)://$USERNAME:$PASSWORD@REMOTE_SERVER/$DATABASE
Replication Target: New Remote Database / New Local Database
New Database: http(s)://$USERNAME:$PASSWORD@REMOTE_SERVER/$DATABASE / 
Replication Type: Continuous
Replication Document: this input can stay blank

Another alternative is to create the replication via an HTTP request such as :



## Views
The design document is based on the argos design document. The only differences are for the 2 views Corpus and User :

* the User view is available to the following address: <http://127.0.0.1:5984/[replicationDatabaseName]/_design/[designDocumentID]/_rewrite/user/offrandes>
* the Corpus view is available to the following address : <http://127.0.0.1:5984/[replicationDatabaseName]/_design/[designDocumentID]/_view/corpus>

These two are necesseary to let Prophyry read the iDAI.field's data. The other ones do not have any real impact on the software reading of the data but are also available and follow the same rules as Argos views.

## Current limitations

This solution lets the user see the items from iDAI.field into Porphyry, using specific map functions. All the data associated to an iDAI item is displayed as an attribute. It is possible, for the user, to add topics/categories like any other item, and this new data is stored in the Argos database.

### Images associated to an item
The images associated to iDAI.field items are currently ignored. In the data model used by iDAI.field, the various image types are all treated as separate items, that have a relation with the item they depict; as such, an item can be associated to several pictures, and a picture can depict more than one item. This is very different from Porphyry v7, where an item was considered equivalent to a picture. This case was also difficult to treat in a map function, as a picture in iDAI.field is a entity (and a document) fully separate from the item it describes.
A second issue is that we currently do not know whether it is possible to access the images stored by the distant iDAI.field database with Porphyry.

### Syncing multiple iDAI.field projects
Another limitation is that, although it is possible to import several iDAI.field projects, the resulting corpora will all have the same name and id "project" - iDAI.field treats every project as an entity that has the id "project" in a separate database, and a map function couldn't recover the project name for each item, as the name is only described in the Project document.

### Replication
Finally, the synchronization between Porphyry and iDAI.field is conditioned by the replication between the databases; if it is interrupted for any reason (this seems to include a restart of the PouchDB server, but this requires further investigation), the two applications will not be synchronized anymore until the replication is resumed.

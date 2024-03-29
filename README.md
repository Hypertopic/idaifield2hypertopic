# iDAI2Hypertopic
Map functions designed to use an iDAI.field database with Hypertopic.

## Introduction
**iDAI.field** is a software, developed by the German Archaeological Institute, designed to document archaeological items found during field research. 

For more information on iDAI.field, please check this repository : <https://github.com/dainst/idai-field>.

The goal of this project is to find a way to connect Porphyry to iDAI.field, and to use the data stored in an iDAI.field database in Porphyry, using the Hypertopic protocol.

This solution lets the user see the items from iDAI.field into Porphyry, using specific map functions. All the data associated to an iDAI item is displayed as an attribute. It is possible, for the user, to add topics/categories like any other item, and this new data is stored in the Argos database. It is even possible to update the attributes coming from iDAI.field. However the modifications will only be visible in Porphyry and not in iDAI.field.

## Requirements

* [CouchDB](http://couchdb.apache.org/)
* [Porphyry](https://github.com/Hypertopic/Porphyry)

## Configuration

### 1. Continuous replication of the databases
For each project created in iDAI.field, the software creates a separate database. This one contains at least one document with `_id: project` which is the project document. It also creates one document per item, image or location. In porphyry, each project will be read as a corpus.

To let Porphyry read the data of iDAI.field, you first need to replicate the data in your own CouchDB database. An easy way to proceed the replication is to use the CouchDB web interface, Fauxton. In the `Replication` part, you need to fill in these informations :

* Replication Source: `Remote Database` / `Local Database`
* Source Name: `http(s)://$USERNAME:$PASSWORD@REMOTE_SERVER/$DATABASE` / `$DATABASE`
* Replication Target: `New Remote Database` / `New Local Database`
* New Database: `http(s)://$USERNAME:$PASSWORD@REMOTE_SERVER/$DATABASE` / `$DATABASE`
* Replication Type: `Continuous`
* Replication Document: This field can be left empty.

Another alternative is to create the replication via an HTTP POST request <http://127.0.0.1:5984/_replicate> with a service such as RESTClient:

        {
          "source":"db", 
          "target":"db-replica", 
          "continuous":true
        }

### 2. Argos installation
Once the databases are replicated, follow the installation procedure of Argos described here : <https://github.com/Hypertopic/Argos> in each duplicated database. This will add a design document `_design/argos` with the following set of views :
* attribute
* corpus
* corpusV1
* empty
* fragmentV1
* resource
* stats
* user
* viewpoint
* viewpointV1

### 3. Views' update
To let Porphyry read the iDAI.field data correctly, the view **user** and **corpus** need to be updated with the corresponding map functions available on this repository. These two views can now be accessed via the following addresses:

* User view: <http://127.0.0.1:5984/[replicationDatabaseName]/_design/argos/_rewrite/user/offrandes>
* Corpus view: <http://127.0.0.1:5984/[replicationDatabaseName]/_design/argos/_view/corpus>

### 4. Porphyry's configuration update
The final step is to add the link towards each database in the list of Porphyry's services. To do so, open the configuration file at `src/config/config.json` and add the links after the other ones like the example :

        "http://127.0.0.1:5984/[replicationDatabaseName]/_design/argos/_rewrite"
        
Make sure that the user is set to `offrandes`.

## Current limitations

### Images associated to an item
The images associated to iDAI.field items are currently ignored. In the data model used by iDAI.field, the various image types are all treated as separate items, that have a relation with the item they depict; as such, an item can be associated to several pictures, and a picture can depict more than one item. This is very different from Porphyry v7, where an item was considered equivalent to a picture. This case was also difficult to treat in a map function, as a picture in iDAI.field is a entity (and a document) fully separate from the item it describes.

A second issue is that we currently do not know whether it is possible to access the images stored by the distant iDAI.field database with Porphyry. In fact, the database only store the image's `id` property and not the complete path. It is possible only to know this path when we choose to create local projects (this is written in the `config` file of iDAI.field `"imagestorePath":$PATH`).

### Syncing multiple iDAI.field projects
Another limitation is that, although it is possible to import several iDAI.field projects, the resulting corpora will all have the same name and id `project` - iDAI.field treats every project as an entity that has the id `project` in a separate database, and a map function could not recover the project name for each item, as the name is only described in the Project document.

### Replication
Finally, the synchronization between Porphyry and iDAI.field is conditioned by the replication between the databases; if it is interrupted for any reason (this seems to include a restart of the PouchDB server, but this requires further investigation), the two applications will not be synchronized anymore until the replication is resumed.

// corpus map
function(o) {
    function isReserved(key) {
    switch (key) {
        case "_id":
        case "_rev": 
        case "_attachments":
        case "_deleted_conflicts":
        case "_conflicts":
        case "item_corpus":
        case "item_name":
        case "thumbnail":
        case "resource":
        case "topics":
        case "highlights": 
        case "identifier":// Name
        case "relations":
        case "geometry": return true;
        }
        return false;
    }
    
    function emitNestedData(previousKey, previousEntry)
    {
      // Level 2 system's data examples                     // Level 2 system's data examples
      // key = key3                                         // key = key2
      // previousKey = key + ":" + key2                     // previousKey = key
      // entry = entry3                                     // entry = entry2
      // previousEntry = entry2[key + ":" + key2]           // previousEntry = entry[key]
              
      for (var key in previousEntry)
      {
        if (!isReserved(key)) 
        {
          var entry = {};
          entry[previousKey + ":" + key] = previousEntry[key];
          if (typeof entry[previousKey + ":" + key] == "object")
          {
            emitNestedData(previousKey + ":" + key, entry[previousKey + ":" + key]);
          } 
          else 
          {
            // Boolean to string conversion (Porphyry does not show the boolean !)
            if(typeof previousEntry[key] == "boolean")
            {
              entry[previousKey + ":" + key] = entry[previousKey + ":" + key].toString();
            }
            emit(["project", o._id], entry);
          }
        }
      }
    }
    
    if (o.resource) {
        if (o.resource.type == "Project")
        {
            // Corpus
            emit([o._id], {name:o._id});
            emit([o._id], {user:"offrandes"});
        }
        else if (o.resource.type == "Photo" || o.resource.type == "Drawing" || o.resource.type == "Image")
        {
            // All kind of images, ignored
        }
        else if (o.resource.type == "Survey" || o.resource.type == "Room" || o.resource.type == "Building" || o.resource.type == "Trench" || o.resource.type == "Feature") 
        {
            // All kind of buildings, ignored.
        }
        else // Item
        {
            emit(["project", o._id], {name:o.resource.identifier});
  
            for (var key in o.resource)
            {
              if (!isReserved(key)) 
              {
                var entry = {};
                entry[key] = o.resource[key];
                if (typeof entry[key] == "object")
                {
                  emitNestedData(key, entry[key]);
                } 
                else 
                {
                  emit(["project", o._id], entry);
                }
              }
            }
        }
    }
}
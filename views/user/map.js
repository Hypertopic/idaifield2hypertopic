function(o) {
  
  if (o.resource) {
        if (o.resource.type == "Project")
        {
            // Corpus
            emit(["offrandes"], {corpus:{id:o._id, name:o._id}});
        }
  }
}
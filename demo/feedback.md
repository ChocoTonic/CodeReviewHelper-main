use the with statement for managing database connections to ensure they are always closed properly, even if an error occurs

move exception handling closer to the database operations to manage errors more precisely. differentiate between database-specific and general exceptions

explicitly return none in case of failure, and check this return in the main function to handle unsuccessful operations more cleanly

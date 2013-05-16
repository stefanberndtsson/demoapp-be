Demo-App Post-IT Backend (node.js)
==================================

Requirements
------------
1. Node.js
2. PostgreSQL
3. Database named "notey"
4. Demo-App Post-IT Frontend (angularjs)
5. Set CORS-headers in resource.js to proper Origin for Frontend

Database schema
---------------
<code>
CREATE TABLE users (
  id SERIAL,
  name TEXT,
  username TEXT,
  password TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE TABLE notes (
  id SERIAL,
  user_id INTEGER,
  title TEXT,
  body TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  deleted_at TIMESTAMP,
  archived_at TIMESTAMP
);
</code>

TODO
----
Deleting and archiving.

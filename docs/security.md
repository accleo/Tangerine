# Security

## CouchDb Security
Most security in Tangerine is handled by CouchDB. In order to understand Tangerine security, it's important to first understand CouchDB security.

### Permissions in CouchDB
This is a list of different permissions in CouchDB. In CouchDB you do not give any one user specific permissions, a user is given a set of permissions as determined by various mechanisms described in the next section.  

__User permissions__:
- Read `_users`.
- Edit `_users` documents (ie. edit a User's `role` array)

__Database permissions__:
- Create database
- Read Databases
- Delete database

__Document permissions__:
- Read database's own documents.
- Write database's own documents.
- Read any databases' documents.
- Write any databases' documents.

__Design Document permissions__:
- Read database's own design documents.
- Write database's own design documents
- Read any databases' design documents.
- Write any databases' design documents.


### How permissions are granted 

- __Super Admins__: These are the admins you would usually define when you first install couchdb by modifying the `couchdb.ini` file or adding them via the user interface. In Tangerine, you add the database user by defining it in the `T_ADMIN`:`T_PASS` environment variables in your container as passed in by `config.sh`.
  - Create databases.
  - Read Databases.
  - Delete databases.
  - Read `_users`.
  - Edit `_users` documents (ie. role)
  - Read any databases' design documents.
  - Write any databases' design documents.
  - Read any databases' documents.
  - Write any databases' documents.

- __Database Admins__: These are regular users in CouchDB that are added as a "database admin" by either adding them to the `/<database name>/_security` doc by name or by role.
  - Read database's documents.
  - Read database's design documens.
  - Write to databases's design documents

- __Database Members__: These are regular users in CouchDB that are added as a "database admin" by either adding them to the `/<database name>/_security` doc by name or by role. If no members on database gives anonymous users these permissions. This is very dangerous!
  - Read database's documents.
  - Read database's design documents.
  - Write database's documents. (unless validation function rejects it)

- __Anonymous users__:
  - CouchDB in admin party mode
    - all the things
  - Non admin party mode...
    - can create account?


### Other CouchDB security notes
- Validation functions are special functions that live in design docs. Using them, database admins and Super admins are able to define __finer grain write access to documents__. For example, when a user with role `foo` tries to write a document with a property of `"collection": "bar"` to a database, a validation function in that database could inspect that user object and uploaded document to make sure that the user does indeed have the `foo` role.  
- Super admin users don't show up in the `_users` database.
- Super admin users do have a user object in their session which contains a role of `_admin`.
- Super admin users are the only users that can update User documents.


## Tangerine Application Security on Serverside 
Tangerine Application Security on the serverside consists of two APIs, CouchDB and Tangerine's custom API `/robbert`. While they are two different APIs, they both grant permissions based on `roles` array on the User's doc. When combined, this is the list of grants each role gives.

- `manager`
	- Create Group
- `<group name>-member`
	- Create Assessments in this group
	- Read Assessments in this group
	- Edit Assessments in this group
- `<group name>-admin`
	- Create Assessments in this group
	- Read Assessments in this group
	- Edit Assessments in this group
	- Add members in this group 
	- Add admins in this group 

Roles in Tangerine are literally `roles` on the user documents in CouchDB. 

Most permissions are handled are handled via CouchDB's own security because each group's database is exposed without any additional proxy security logic. When a group is created, two roles are added to that group's CouchDB database `/group-<group name>/_security` endpoint. `<group name>-admin` role is added the group's Admin Role and `<group name>-member` is added to the group's member role. All users are standard CouchDB users so they are limited to access to the databases that their own roles permit. They are also limited to editing their own user Doc so role escalation is not possible. However, some users with `manager` role can create a Group which then creates a Database even though they are normal CouchDB users. This is possible because of Tangerine's custom API.  

By default, Tangerine's custom API allows users with `manager` role to create `group-<group name>` databases without having to be super admin. This is done via the `/robbert/group/new` endpoint which checks the Permission Grants that user's roles have been given to see if any of the granted permissions is "Create Group". The permissions granted for specific roles are listed in the `acl` document in the `tangerine` database. ACL stands for "Access Control List".  

Default `acl` doc:
```
{
   "_id": "acl",
   "_rev": "11-9ff945e90521cba49bf5ccc01ef9b855",
   "roles": [
       {
           "name": "manager",
           "permissions": [
               "Create new group"
           ]
       }
   ]
}
```


There are three different security recipes for databases in Tangerine.
	- `tangerine` database: No members or admins so reading wide open. Writes are protected by a `_design/_auth` design docs that contains a validation function that only allows Super Admins to write to that database (role of `_admin`).
  - `group-<group name>` database: `/group-<group name>/_security` endpoint is set to `<group name>-admin` for admin roles and `<group name>-member` for member roles. 
  - `deleted-<group name>` database: The database's `_security` member and admin names are set to the user defined in `T_ADMIN`   
  

@TODO: Describe upload user.



## Tangerine Application Client Security
@TODO

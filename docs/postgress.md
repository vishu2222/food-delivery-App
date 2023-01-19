#### PostGis datatype:

postGis geometry type is for plane geometry
postGis geographic type is for spherical geometry

#### point

- is a geometric type to represent two-dimensional spatial objects
- Values of type point are specified using either (x, y) or x,y
- (x,y) =(long, lat)

#### Example

##### Ref: https://stackoverflow.com/questions/8150721/which-data-type-for-latitude-and-longitude

create table loc(
location geography;
)
insert into your_table (geog) values ('SRID=4326;POINT(longitude latitude)');

#### distance between two places

##### Ref: http://postgis.net/workshops/postgis-intro/geography.html

SELECT ST_Distance(
'SRID=4326;POINT(-118.4079 33.9434)'::geography, -- Los Angeles (LAX)
'SRID=4326;POINT(2.5559 49.0083)'::geography -- Paris (CDG)
);

- the above result will be in meters
- SRID of 4326 declares a geographic spatial reference system. The units for spatial reference 4326 are degrees.

http://postgis.net/workshops/postgis-intro/geography.html
https://www.postgresql.org/docs/current/datatype-geometric.html
https://www.postgresql.org/docs/8.2/functions-geometry.html
http://postgis.net/workshops/postgis-intro/geometries.html
https://postgis.net/workshops/postgis-intro/projection.html

calculate distances, insert points, create tables
https://www.crunchydata.com/blog/postgis-and-the-geography-type

####

lat long to distance in km if R is in KM
https://math.stackexchange.com/questions/29157/how-do-i-convert-the-distance-between-two-lat-long-points-into-feet-meters#:~:text=If%20the%20distances%20are%20small,units%20you%20used%20for%20R.

#### js library that gives dR in meters

https://www.npmjs.com/package/geolib

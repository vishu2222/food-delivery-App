-- drop type user_type cascade;
-- drop table users cascade;
-- drop table customer cascade;
-- drop table customer_address cascade;
-- drop table delivery_partner cascade;
-- drop table restaurant cascade;
-- drop table food_item;
-- drop type order_status_type cascade;
-- drop table orders;
-- drop table sessions;


-- 
CREATE TYPE user_type  AS ENUM('customer', 'restaurant', 'delivery_partner');
--
CREATE TABLE users(
	user_id			serial primary key,
	user_name       varchar not null unique,
	user_type       user_type not null,
	created_at      timestamp default NOW(),
	password	    varchar not null
);


-- 
CREATE TABLE sessions(
	session_id		varchar primary key,
	user_id  		integer,
	created_at 		timestamp default NOW(),
	constraint fk_sessions_users foreign key(user_id) references users(user_id)
);


--
create table customer( 
	customer_id        		   serial primary key,
	customer_name			   varchar not null,
	phone			           varchar not null unique,
	email			           varchar,
	user_id					   integer not null,
	constraint fk_users_customers foreign key(user_id) references users(user_id)
);


--
create table customer_address(
	address_id				   serial primary key,
	lat						   real,
	long 					   real,
	house_no			       varchar,
	locality                   varchar,
	city					   varchar,
	state                      varchar,
	pincode                    varchar,
	customer_id                integer not null,
	constraint fk_customer_customer_address foreign key(customer_id) references customer(customer_id)
);

-- insert into customer_address(city, customer_id) values('bangalore', 1);


--delivery_partner
create table delivery_partner(
	partner_id			        serial primary key,
	partner_name				varchar not null,
	availability	            boolean not null default true, -- false
	phone               		varchar not null unique,
	user_id					    integer not null,
    constraint fk_users_partner foreign key(user_id) references users(user_id)
);


--
create table restaurant(
	restaurant_id	       	    serial primary key,
	restaurant_name				varchar not null,
	phone				        varchar unique,
	lat							real not null,
	long						real not null,
	address						varchar,
	city						varchar,
	start_time			        varchar not null,
	close_time			        varchar not null,
	user_id					    integer not null,
	img					        varchar,
    constraint fk_users_restaurant foreign key(user_id) references users(user_id)
);


create table food_item(
	item_id				serial primary key,
	item_name			varchar not null,
	price 				integer not null,
	description			varchar,
	category           	varchar,
	availability 		boolean,
	img			        varchar,
	restaurant_id		integer not null,
	constraint fk_item_restaruant foreign key(restaurant_id) references restaurant(restaurant_id)
);

-- 
CREATE TYPE order_status_type  AS ENUM('awaiting restaurant confirmation', 'searching for delivery partner', 'awaiting pickup', 'awaiting delivery', 'delivered', 'restaurant rejected', 'cancelled');

create table orders(
	order_id			  serial primary key,
	order_time			  timestamp not null,
	delivery_time		  timestamp,
	total_price			  real not null, -- use integer for price
	status                order_status_type not null,
	customer_id			  integer not null,
	address_id			  integer not null,
	restaurant_id		  integer not null,
	partner_id			  integer,
	order_items 		  JSONB not null,
	created_at			  timestamp default NOW(),
	updated_at 			  timestamp default NOW(),
	constraint fk_order_restaurant foreign key(restaurant_id) references restaurant(restaurant_id),
	constraint fk_order_partner foreign key(partner_id) references delivery_partner(partner_id),
	constraint fk_order_customer foreign key(customer_id) references customer(customer_id),
	constraint fk_order_address foreign key(address_id) references customer_address(address_id)
);


select * from users;
select * from customer;
select * from restaurant;
select * from food_item;
select * from customer_address;
select * from orders;
select * from delivery_partner;
select * from sessions;








drop table customers cascade;
create table customers(
	customer_id        serial primary key,
	username           varchar not null,
	password           varchar not null,
	name			   varchar not null,
	phone			   varchar not null,
	email			   varchar
);

drop table address;
create table address(
	address_id		   serial primary key,
	customer_id        integer,
	delivary_address   varchar,
	-- location		   geography
	lat				   real,
	long			   real,
	constraint fk_customers_address foreign key(customer_id) references customers(customer_id)
);

drop table delivary_agent cascade;
create table delivary_agent(
	person_id			serial primary key,
	name				varchar not null,
	availability		boolean not null,
	phone				varchar not null,
	-- current_location    geography
	lat 				real,
	long				real
);


drop table restaurant cascade;
create table restaurant(
	restaurant_id		serial primary key,
	name				varchar not null,
	phone				varchar,
-- 	location			geography,
	lat 				real,
	long				real,
	closed				boolean
);

drop table items cascade;
create table items(
	item_id				serial primary key,
	name				varchar not null,
	availability 		boolean default false,
	price 				real not null,
	restaurant_id		integer,
	image			    varchar,
	constraint fk_item_restaruant foreign key(restaurant_id) references restaurant(restaurant_id)
);

drop table orders cascade;
create table orders(
	order_id			serial primary key,
	order_time			timestamp not null,
	delivary_time		timestamp not null,
	total_price			real not null,
	distance			real not null,
	order_status		boolean not null,
	payment_done		boolean not null,
	restaurant_id		integer,
	agent_id			integer,
	constraint fk_orders_restaurant foreign key(restaurant_id) references restaurant(restaurant_id),
	constraint fk_orders_agent foreign key(agent_id) references delivary_agent(person_id)
);

drop table order_items;
create table order_items(
	id					serial primary key,
	order_id			integer,
	item_id				integer,
	quantity			integer not null,
	constraint fk_order_items_order foreign key(order_id) references orders(order_id),
	constraint fk_order_items_items foreign key(item_id) references items(item_id)
);





--insert into customers (customer_id,username,password,name,location) values (1,'user1','pwd1','user1','SRID=4326;POINT(0 0)');
--select * from customers;

-- select * 
-- from customers 
-- order by location <-> 'SRID=4326;POINT(1 1)' 
-- limit 5;



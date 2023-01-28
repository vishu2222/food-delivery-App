-- drop table customer cascade;
-- drop table delivary_partner cascade;
-- drop table restaurant cascade;
-- drop table food_item;
-- drop table orders;

create table customer( 
	customer_id        		   serial primary key,
	customer_name			   varchar not null,
	phone			           varchar not null,  -- need validation? should be an integer? -- unique?
	email			           varchar
);

insert into customer(customer_name, phone) values ('customer1', '1111111111');

create table delivary_partner(
	partner_id			        serial primary key,
	partner_name				varchar not null,
	availability	            boolean not null, -- default false?
	phone               		varchar not null  -- need validation? should be an integer? -- unique?
);

insert into delivary_partner( partner_name, availability , phone) values('delivary partner1', true, 9888888888);

create table restaurant(
	restaurant_id	       	    serial primary key,
	restaurant_name				varchar not null,
	phone				        varchar, -- need validation? should be an integer? -- unique?
	img					        varchar,
	start_time			        timestamp, -- not null?
	close_time			        timestamp  -- not null?
);

insert into restaurant(restaurant_name, phone, start_time, close_time) values('restaurant1', '2222222222', to_timestamp('08:00:00', 'HH24:MI:SS'), to_timestamp('21:59:59', 'HH24:MI:SS'));

create table food_item(
	item_id				serial primary key,
	item_name			varchar not null,
	price 				real not null,
	description			varchar,
	category           	varchar,
	availability 		boolean, -- default false?
	img			        varchar,
	restaurant_id		integer not null,
	constraint fk_item_restaruant foreign key(restaurant_id) references restaurant(restaurant_id)
);

insert into food_item(item_name, price, restaurant_id) values ('item1', 100, 1);

create table orders(
	order_id			  serial primary key,
	order_time			  timestamp not null, -- default NOW()?
	delivary_time		  timestamp,
	total_price			  real not null,
	restaurant_confirmed  boolean default false,
	partner_confirmed	  boolean default false,   
	delivary_status       varchar not null default 'pending' check (delivary_status in ('pending', 'delivered')),
	customer_id			  integer not null,
	restaurant_id		  integer not null,
	partner_id			  integer,
	order_items 		  json not null,
-- 	payment_done		  boolean not null, 
	constraint fk_order_restaurant foreign key(restaurant_id) references restaurant(restaurant_id),
	constraint fk_order_partner foreign key(partner_id) references delivary_partner(partner_id),
	constraint fk_order_customer foreign key(customer_id) references customer(customer_id)
);

-- customer insert
insert into orders(order_time, total_price, customer_id, restaurant_id, order_items) values (now(), 100, 1,1,'[{"item_id": 1, "quantity": 2, "price": 25.0}, {"item_id": 2, "quantity": 1, "price": 50.0}]');


-- select * from customer;
-- select * from delivary_partner;
-- select * from restaurant;
-- select * from food_item;
-- select * from orders;







-- delete from order_items where id>0;
-- delete from orders where order_id>0;



# --- Created by Ebean DDL
# To stop Ebean DDL generation, remove this comment and start using Evolutions

# --- !Ups

create table boat (
  id                        bigint not null,
  boat_name                 varchar(255),
  boat_type                 varchar(255),
  build_year                integer,
  register_nr               varchar(255),
  constructor               varchar(255),
  engine                    varchar(255),
  sail_sign                 varchar(255),
  boat_length               double,
  fueltank_size             double,
  home_port                 varchar(255),
  boat_width                double,
  watertank_size            double,
  draught                   double,
  yachtclub                 varchar(255),
  wastewatertank_size       double,
  owner                     varchar(255),
  mast_height               double,
  mainsail_size             double,
  insurance                 varchar(255),
  water_displacement        double,
  genua_size                double,
  callsign                  varchar(255),
  rig_kind                  varchar(255),
  spi_size                  double,
  constraint pk_boat primary key (id))
;

create table trip (
  id                        bigint not null,
  boat_id                   bigint,
  trip_title                varchar(255),
  trip_from                 varchar(255),
  trip_to                   varchar(255),
  crew                      varchar(255),
  start_time                timestamp,
  end_time                  timestamp,
  engine_runtime            integer,
  skipper                   varchar(255),
  tank_filled               boolean,
  note                      varchar(255),
  constraint pk_trip primary key (id))
;

create sequence boat_seq;

create sequence trip_seq;




# --- !Downs

SET REFERENTIAL_INTEGRITY FALSE;

drop table if exists boat;

drop table if exists trip;

SET REFERENTIAL_INTEGRITY TRUE;

drop sequence if exists boat_seq;

drop sequence if exists trip_seq;


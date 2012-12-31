# --- Created by Ebean DDL
# To stop Ebean DDL generation, remove this comment and start using Evolutions

# --- !Ups

create table boat (
  id                        bigint not null,
  bla                       integer,
  name                      varchar(255),
  constraint pk_boat primary key (id))
;

create sequence boat_seq;




# --- !Downs

SET REFERENTIAL_INTEGRITY FALSE;

drop table if exists boat;

SET REFERENTIAL_INTEGRITY TRUE;

drop sequence if exists boat_seq;


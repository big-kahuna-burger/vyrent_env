CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: public."Users"

DROP TABLE IF EXISTS public."Users";

CREATE TABLE public."Users"
(
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  external_id text NOT NULL,
  created_at date NOT NULL DEFAULT now(),
  updated_at date NOT NULL DEFAULT now(),
  CONSTRAINT users_pk PRIMARY KEY (id),
  CONSTRAINT users_external_id_uq UNIQUE (external_id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE public."Users"
  OWNER TO postgres;

-- Index: public.users_external_id_in

DROP INDEX IF EXISTS public.users_external_id_in;

CREATE INDEX users_external_id_in
  ON public."Users"
  USING btree
  (external_id COLLATE pg_catalog."default");
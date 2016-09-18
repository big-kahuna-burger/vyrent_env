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


-- Type: public.vendor_status

DROP TYPE IF EXISTS public.vendor_status;

CREATE TYPE public.vendor_status AS ENUM
   ('trusted',
    'approved',
    'initial');
ALTER TYPE public.vendor_status
  OWNER TO postgres;

-- Table: public."Vendors"

DROP TABLE IF EXISTS public."Vendors";

CREATE TABLE public."Vendors"
(
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name text,
  created_at date NOT NULL DEFAULT now(),
  updated_at date NOT NULL DEFAULT now(),
  company_legal_name text NOT NULL,
  dba text NOT NULL,
  status vendor_status NOT NULL DEFAULT 'initial'::vendor_status,
  CONSTRAINT vendors_pk PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE public."Vendors"
  OWNER TO postgres;

-- Table: public."User_Vendor"

DROP TABLE IF EXISTS public."User_Vendor";

CREATE TABLE public."User_Vendor"
(
  user_id uuid NOT NULL,
  vendor_id uuid NOT NULL,
  CONSTRAINT user_vendor_id_pk PRIMARY KEY (user_id, vendor_id),
  CONSTRAINT user_vendor_user_id_fk FOREIGN KEY (user_id)
      REFERENCES public."Users" (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT user_vendor_vendor_id_fk FOREIGN KEY (vendor_id)
      REFERENCES public."Vendors" (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);
ALTER TABLE public."User_Vendor"
  OWNER TO postgres;

-- Index: public.fki_user_vendor_user_id_fk

DROP INDEX IF EXISTS public.fki_user_vendor_user_id_fk;

CREATE INDEX fki_user_vendor_user_id_fk
  ON public."User_Vendor"
  USING btree
  (user_id);

-- Index: public.fki_user_vendor_vendor_id_fk

DROP INDEX IF EXISTS public.fki_user_vendor_vendor_id_fk;

CREATE INDEX fki_user_vendor_vendor_id_fk
  ON public."User_Vendor"
  USING btree
  (vendor_id);
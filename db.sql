CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: public."Users"

DROP TABLE IF EXISTS public."Users" CASCADE;

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

DROP TYPE IF EXISTS public.vendor_status  CASCADE;

CREATE TYPE public.vendor_status AS ENUM
   ('trusted',
    'approved',
    'initial',
    'decliend');
ALTER TYPE public.vendor_status
  OWNER TO postgres;

-- Table: public."Vendors"

DROP TABLE IF EXISTS public."Vendors"  CASCADE;

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

-- Table: public."Watches"

DROP TABLE IF EXISTS public."Watches" CASCADE;

CREATE TABLE public."Watches"
(
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  model text NOT NULL,
  version text,
  reference_number text,
  gender text,
  retail_price text,
  cost_price text,
  description text,
  movement text,
  case_diameter text,
  case_material text,
  bezel text,
  band text,
  band_material text,
  clasp text,
  accessories text,
  vyrent_sku text,
  year text,
  created_at date NOT NULL DEFAULT now(),
  updated_at date NOT NULL DEFAULT now(),
  brand text,
  pictures json,
  vendor_id uuid NOT NULL,
  featured boolean DEFAULT false,
  CONSTRAINT watches_pk PRIMARY KEY (id),
  CONSTRAINT watches_vendor_id_fk FOREIGN KEY (vendor_id)
      REFERENCES public."Vendors" (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);
ALTER TABLE public."Watches"
  OWNER TO postgres;

-- Index: public.fki_watches_vendor_id_fk

DROP INDEX IF EXISTS public.fki_watches_vendor_id_fk;

CREATE INDEX fki_watches_vendor_id_fk
  ON public."Watches"
  USING btree
  (vendor_id);

-- Type: public.application_status

DROP TYPE public.application_status CASCADE;

CREATE TYPE public.application_status AS ENUM
   ('draft',
    'final decision',
    'deny',
    'under review',
    'pending');
ALTER TYPE public.application_status
  OWNER TO postgres;

-- Table: public."Applications"

DROP TABLE IF EXISTS public."Applications"  CASCADE;

CREATE TABLE public."Applications"
(
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  status application_status NOT NULL DEFAULT 'pending'::application_status,
  created_at date NOT NULL DEFAULT now(),
  updated_at date NOT NULL DEFAULT now(),
  CONSTRAINT applications_pk PRIMARY KEY (id),
  CONSTRAINT applications_user_id_fk FOREIGN KEY (user_id)
      REFERENCES public."Users" (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);
ALTER TABLE public."Applications"
  OWNER TO postgres;

-- Index: public.fki_applications_user_id_fk

DROP INDEX IF EXISTS public.fki_applications_user_id_fk;

CREATE INDEX fki_applications_user_id_fk
  ON public."Applications"
  USING btree
  (user_id);

-- Type: public.application_watch_status

DROP TYPE public.application_watch_status CASCADE;

CREATE TYPE public.application_watch_status AS ENUM
   ('approved',
    'denied',
    'pending',
    'under review');
ALTER TYPE public.application_watch_status
  OWNER TO postgres;

-- Type: public.application_watch_source

DROP TYPE public.application_watch_source CASCADE;

CREATE TYPE public.application_watch_source AS ENUM
   ('user',
    'admin');
ALTER TYPE public.application_watch_source
  OWNER TO postgres;

-- Table: public."Application_Watches"

DROP TABLE public."Application_Watches";

CREATE TABLE public."Application_Watches"
(
  watch_id uuid NOT NULL,
  application_id uuid NOT NULL,
  source application_watch_source NOT NULL DEFAULT 'user'::application_watch_source,
  created_at date NOT NULL DEFAULT now(),
  updated_at date NOT NULL DEFAULT now(),
  status application_watch_status NOT NULL DEFAULT 'pending'::application_watch_status,
  CONSTRAINT applications_watches_pk PRIMARY KEY (watch_id, application_id),
  CONSTRAINT application_watches_fk FOREIGN KEY (application_id)
      REFERENCES public."Applications" (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT applications_watch_fk FOREIGN KEY (watch_id)
      REFERENCES public."Watches" (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);
ALTER TABLE public."Application_Watches"
  OWNER TO postgres;


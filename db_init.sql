--
-- PostgreSQL database dump
--

-- Dumped from database version 9.5.25
-- Dumped by pg_dump version 9.5.25

-- Started on 2022-01-13 00:30:04

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 558 (class 1247 OID 101527)
-- Name: role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.role AS ENUM (
    'READ_ONLY',
    'READ_WRITE'
);


ALTER TYPE public.role OWNER TO postgres;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 182 (class 1259 OID 85196)
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    price numeric(6,2)
);


ALTER TABLE public.products OWNER TO postgres;

--
-- TOC entry 183 (class 1259 OID 85199)
-- Name: Products_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Products_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Products_id_seq" OWNER TO postgres;

--
-- TOC entry 2127 (class 0 OID 0)
-- Dependencies: 183
-- Name: Products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Products_id_seq" OWNED BY public.products.id;


--
-- TOC entry 184 (class 1259 OID 101531)
-- Name: authentication_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.authentication_tokens (
    token text NOT NULL,
    role public.role NOT NULL
);


ALTER TABLE public.authentication_tokens OWNER TO postgres;

--
-- TOC entry 181 (class 1259 OID 85192)
-- Name: keys; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.keys (
    key character(19) NOT NULL,
    related_product integer NOT NULL,
    expiration_date timestamp with time zone NOT NULL
);


ALTER TABLE public.keys OWNER TO postgres;

--
-- TOC entry 1993 (class 2604 OID 85201)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public."Products_id_seq"'::regclass);


--
-- TOC entry 2128 (class 0 OID 0)
-- Dependencies: 183
-- Name: Products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Products_id_seq"', 1, false);


--
-- TOC entry 2119 (class 0 OID 101531)
-- Dependencies: 184
-- Data for Name: authentication_tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.authentication_tokens VALUES ('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiUkVBRF9XUklURSIsImlhdCI6MTY0MTk5NzUwMTE0NSwiZXhwIjoxODMxMjk5OTAxLjE0M30.4ixLwkixIZOQFH1ZfScUKPFVdaoTumtD2SmYzolnAao', 'READ_WRITE');
INSERT INTO public.authentication_tokens VALUES ('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiUkVBRF9PTkxZIiwiaWF0IjoxNjQxOTk3NTAxMTQ1LCJleHAiOjE4MzEyOTk5MDEuMTQzfQ.WQtCl-u4hWOG2QBc8CUhH4iXjPVGxwtn3TYu8MVrWc4', 'READ_ONLY');
INSERT INTO public.authentication_tokens VALUES ('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiUkVBRF9XUklURSIsImlhdCI6MTY0MTk5NzY1NDI3MCwiZXhwIjoxNTQ3MzAzMjU0LjI3fQ.yITL2_Q6-kdpM6EbXbPRG0QhaPDxO4ANT7Dv0XW-Fqc', 'READ_WRITE');
INSERT INTO public.authentication_tokens VALUES ('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiUkVBRF9PTkxZIiwiaWF0IjoxNjQxOTk3NjU0MjcxLCJleHAiOjE1NDczMDMyNTQuMjd9.MGwBchftGKjnwzs-SNfXfFF9DvmLmqO63K5NI9Wk34g', 'READ_ONLY');


--
-- TOC entry 2116 (class 0 OID 85192)
-- Dependencies: 181
-- Data for Name: keys; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.keys VALUES ('8315-Y561-510A-JP7C', 1, '2019-01-12 19:46:15.333+03');
INSERT INTO public.keys VALUES ('2G4K-8308-3X2C-27MO', 2, '2019-01-12 19:46:15.333+03');
INSERT INTO public.keys VALUES ('V33E-L0X4-F2LK-3E29', 2, '2019-01-12 19:46:15.333+03');
INSERT INTO public.keys VALUES ('4YQD-Y58T-MHWF-J00Z', 1, '2019-01-12 19:46:15.333+03');
INSERT INTO public.keys VALUES ('CG6H-XU21-N89U-1MM2', 3, '2019-01-12 19:46:15.333+03');
INSERT INTO public.keys VALUES ('S926-CXON-9YCG-9H2S', 4, '2019-01-12 19:46:15.333+03');
INSERT INTO public.keys VALUES ('O86M-JTE1-9GJD-F8N0', 6, '2019-01-12 19:46:15.333+03');
INSERT INTO public.keys VALUES ('6SZO-CU3I-72D6-1476', 7, '2019-01-12 19:46:15.333+03');
INSERT INTO public.keys VALUES ('5230-Q7RJ-O23E-IF1V', 8, '2019-01-12 19:46:15.333+03');
INSERT INTO public.keys VALUES ('74D2-MF9X-NQ9J-GW4Y', 9, '2019-01-12 19:46:15.333+03');
INSERT INTO public.keys VALUES ('BDF5-UK48-881U-1SK2', 10, '2019-01-12 19:46:15.333+03');
INSERT INTO public.keys VALUES ('2969-7G40-3869-TG84', 5, '2019-01-12 19:46:15.333+03');


--
-- TOC entry 2117 (class 0 OID 85196)
-- Dependencies: 182
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.products VALUES (4, 'Windows 8', 10.00);
INSERT INTO public.products VALUES (1, 'Windows XP', 1.99);
INSERT INTO public.products VALUES (2, 'Windows Vista', 2.10);
INSERT INTO public.products VALUES (3, 'Windows 7', 5.00);
INSERT INTO public.products VALUES (5, 'Windows 8.1', 12.50);
INSERT INTO public.products VALUES (6, 'Windows 10', 139.00);
INSERT INTO public.products VALUES (7, 'Windows 11', 199.00);
INSERT INTO public.products VALUES (9, 'Windows Server 2016', 100.00);
INSERT INTO public.products VALUES (10, 'Windows Server 2019', 139.00);
INSERT INTO public.products VALUES (11, 'Windows Server 2022', 199.00);
INSERT INTO public.products VALUES (8, 'Windows Server 2012', 74.99);


--
-- TOC entry 1995 (class 2606 OID 93355)
-- Name: Key_id; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.keys
    ADD CONSTRAINT "Key_id" PRIMARY KEY (key);


--
-- TOC entry 1998 (class 2606 OID 85205)
-- Name: Product_id; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT "Product_id" PRIMARY KEY (id);


--
-- TOC entry 2000 (class 2606 OID 101538)
-- Name: admin_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.authentication_tokens
    ADD CONSTRAINT admin_pk PRIMARY KEY (token);


--
-- TOC entry 1996 (class 1259 OID 85216)
-- Name: fki_Product_of_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "fki_Product_of_key" ON public.keys USING btree (related_product);


--
-- TOC entry 2001 (class 2606 OID 85211)
-- Name: Product_of_key; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.keys
    ADD CONSTRAINT "Product_of_key" FOREIGN KEY (related_product) REFERENCES public.products(id) MATCH FULL ON DELETE CASCADE;


--
-- TOC entry 2126 (class 0 OID 0)
-- Dependencies: 7
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


-- Completed on 2022-01-13 00:30:04

--
-- PostgreSQL database dump complete
--


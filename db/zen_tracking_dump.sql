--
-- PostgreSQL database dump
--

-- Dumped from database version 13.1 (Ubuntu 13.1-1.pgdg20.04+1)
-- Dumped by pg_dump version 13.2

-- Started on 2021-02-22 13:07:18 EET

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public."Marking" DROP CONSTRAINT IF EXISTS "Marking_user_name_fkey";
ALTER TABLE IF EXISTS ONLY public."User" DROP CONSTRAINT IF EXISTS "User_pkey";
ALTER TABLE IF EXISTS ONLY public."Marking" DROP CONSTRAINT IF EXISTS "Marking_pkey";
DROP TABLE IF EXISTS public."User";
DROP TABLE IF EXISTS public."Marking";
DROP EXTENSION IF EXISTS "uuid-ossp";
--
-- TOC entry 2 (class 3079 OID 1595990)
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- TOC entry 3995 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 202 (class 1259 OID 1596432)
-- Name: Marking; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Marking" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    date timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_name character varying(254) NOT NULL,
    comment character varying(254)
);


--
-- TOC entry 201 (class 1259 OID 1596423)
-- Name: User; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."User" (
    name character varying(254) NOT NULL,
    password character varying(254) NOT NULL,
    is_private boolean DEFAULT false NOT NULL
);


--
-- TOC entry 3858 (class 2606 OID 1596441)
-- Name: Marking Marking_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Marking"
    ADD CONSTRAINT "Marking_pkey" PRIMARY KEY (id);


--
-- TOC entry 3856 (class 2606 OID 1596431)
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (name);


--
-- TOC entry 3859 (class 2606 OID 1596442)
-- Name: Marking Marking_user_name_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Marking"
    ADD CONSTRAINT "Marking_user_name_fkey" FOREIGN KEY (user_name) REFERENCES public."User"(name) ON UPDATE CASCADE ON DELETE CASCADE;


-- Completed on 2021-02-22 13:07:25 EET

--
-- PostgreSQL database dump complete
--


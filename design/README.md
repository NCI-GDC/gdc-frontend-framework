# GDC Frontend Framework

## Overview

The GDC Frontend Framework provides a context-aware foundation to build components and websites
on top of. The framework itself should not care about the render technology (react, vue, etc).
However, the initial implementation will utilize Redux as a state container and React-Redux as
an interface to build a React site on top of the framework.

## Terminology

Need a better name for "the website built on top of the framework". Is this a "host site".

## Cohort

A cohort is a collection of cases. We can think of the existing GDC programs and projects as pre-built cohorts. For example, TCGA-BRCA is a pre-built cohort of breast cancer cases.

Side Note: The GDC also has a concept of a "study", where a study is currated collection of cases related to controlled-access data. Studies are also examples of pre-built cohorts. Currently, studies are not exposed to the user. Internally, GDC has a single study, which is for FM-AD.

Cohort building is a key feature of the new site. This allows the user to define and modify their own cohorts.

## Framework Components

### Data and Entity Types

The data types and entity types that the framework knows about. Since these types are specific to the
applications, these types should be a configuration in the framework and not baked into the framework
itself.

### Features

Features are specific functionality built on top of the framework.

### Context

The context defines how the user is looking at the data. For example, they may have selected a
cohort of cases and should now see data filtered for that cohort. There could be multiple contexts.
For example, a user may be running the same analysis on two differnt cohorts for comparison.

### Data Access Layer

The data access layer (DAL) abstracts the data source from the website built on top of the framework.  
The DAL should make a variety of data types and entity types available to website. These data types
and entity types are defined by the framework. The DAL will automatically apply any filtering as
defined by the context. Thus, allowing features to only care about what data they need and not about
how to obtain the data.

### Component Interface

The framework exists to help facilitate interactions between features and the data. To achieve
this, features must declare their requirements. For example, if a feature requires a particular
data type or entity type, then the feature should make this known. The framework needs to
provide a uniform way for features to declare their requirements.

### Authentication

Either the framework or the host application will need to expose authentication.

## Redux Implementation

This implementation of the framework will use redux to store the context. Access to the context will
be exposed through selectors.

The data access layer can expose data in two ways:

1. Use selectors to return data in the store.
2. Dispatch actions to populate data in the store.

We may need another mechanism that allows a component to dispatch an data request and get the response.
This could be done with correlation ids and a selector to get the response for a given correlation id.

## Use Cases

### Cohort Context

1. The user selects a cohort

## User Accounts

Currently, the GDC does not support user accounts. We have SSO integration with dbGaP for data access authorization. Beyond that, neither the front- nor back-end has specific knowledge of the user.

What is the historical reason for not having user accounts? I believe this may be related to additional federal regulations if we have user acccounts. Also, from what I understand, we are not allowed to use any of the identifying information from dbGaP, such as email address. Are we allowed to map a dbGaP identifier to a GDC user id, then have GDC use the user id? If the mapping existing in a separate system, then we may get enough decoupling. Ultimately need to find the root of the issue before we propose solutions.

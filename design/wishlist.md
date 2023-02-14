# Wishlist

## Design Questions

- Should the site be responsive? Yes, but not mobile-first.

## Component Library

### Basic UI components

Use an existing library to start

- material ui
- ant design
- react bootstrap

Requirements

- Customize the library to fit our needs. This requires theming or similar.
- Extend library for components we need but are not standard.
- Add higher-level, composite components
- i18n is optional
- a11y is required. 508c required. wcag probably good

### GDC Feature components

Feature components encapsulate a GDC-specific feature and make that feature reusable
throughout the site. Examples:

- Entity Viewer - For a given entity, display the relevant information. Then, any entity could be inspected to give the user additional details.
- File Download - For a given file or set of files, download them. The set of files may be an unresolved expression. For example, a user may want the STAR - Counts gene expression files for the current cohort.

## a11y

- <https://www.section508.gov/create/applicability-conformance>
- Electronic documents must meet the W3C WCAG 2.0, Level A and AA guidelines (with four exceptions); see 36 CFR 1194 E205 electronic Content, and E205.4 Accessibility Standards
  - <https://www.access-board.gov/ict/#E205-content>
- For web content, see E205, E205.2 and E205.3
- https://www.access-board.gov/ict/#E205.4

WCAG 2.0 Conformance
<https://www.w3.org/TR/UNDERSTANDING-WCAG20/conformance.html>

appears that we need to meet Level A and AA conformance.

## UI Kit

Use storybook or similar to provide a ui kit of gdc components.

## Graphing Library

Ideally, we'd have a single graphing solution.

## Product Tour Library

We should provide a product tour (or user on-boarding) for new users and new features.

Impressions of libraries out there:

- react-joyride
  - uses inline styles for CSS
  - can provide a custom component for body and beacon so styling on that can ultimately be whatever
  - accessible
  - has a pretty rich API: https://docs.react-joyride.com/callback
  - doesn't seem the most actively maintained
  - throws errors with SSR, no docs or examples on how to get it working
- react-shepherd
  - professionally maintained, react wrapper is maintained by same team as main library, well documented
  - classes for CSS but difficult to actually style with tailwind, expects you will provide a stylesheet with their classnames
  - accessible
  - errors with SSR, documented work-around though
- intro.js
  - popular and well maintained, well documented
  - small and no dependencies
  - license situation seems complicated and probably a non-starter: https://introjs.com/#commercial
  - not really geared towards use in a react application, only has third party wrapper
- reactour
  - hook-based, most modern react-like API of the options
  - wasn't mentioned in docs but seems accessible
  - single maintainer
  - inline styles for CSS, can provide custom components which could be styled however though
  - No problems with SSR, very easy to setup
  - Way of handling multiple tours in an application is kind of annoying

## Tech Choices

- React v17+ - v17 introduces backwards and forwards compatibility
- Redux Toolkit
  - opinionated redux
  - all store access via selectors
  - selector access via react hooks
  - all mutation through action dispatching (also via hooks)
  - (move this note) for non-react-redux applications, we may need to expose an object to call selectors and dispatch actions
- TypeScript - will help with data and state shapes
- npm 7 or yarn
  - both support workspaces
- webpack vs rollupjs
  - webpack has been around forever and is well supported
  - rollupjs can create es6 modules
  - use both?

## Server side rendering

It's unclear if we need SSR yet. Regardless, we should strive to write isomorphic javascript to allow for us.

## Content Delivery Network

We should use a CDN for all static assets, including build artifacts. Since we already have an AWS account, we could use CloudFront. If we do this, we'll need to determine how to setup or bypass a CDN per environement. (prod-blue, prod-green, qa-\*, dev clusters)

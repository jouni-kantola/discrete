# discrete

An opinionated workflow for creating front-end components.
- The framework depends on a event bus and a virtual DOM.
- A component consists of a relationship to the event bus and to the virtual DOM.
 
The workflow is based on the following conceptual idea:
- A component is a conceptual atomic unit. During development markup, styles and scripts are unknowing of it's runtime environment and other components.
- Before using in runtime components have been ordered and bundled. The only dependencies are DOM parent-to-child relationships.
- Communication between components are handled by publish/subscribe of events by an event bus.
- Components are unknowing of subscribers and whether subscribers have handled events. A component bootstraps event subscription.

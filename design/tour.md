# Tour Setup

The product tour is implemented using the [react tour library](https://github.com/elrumordelaluz/reactour).

To add steps to the tour:

- Add ids to the HTML elements you want for tour stops
- Add the id and content of the step to the `features/tour/steps.ts` file with the properties described here: https://github.com/elrumordelaluz/reactour/tree/master/packages/tour#tourprovider

It's possible to have multiple tours in a single app. You can use the `setSteps` hook provided by react-tour to show different steps based on the page, ex:

```
import { useRouter } from 'next/router'
import { useTour } from "@reactour/tour";
import steps from '../../features/tour/steps';

const { setSteps } = useTour();
const router = useRouter();

setSteps(steps[router.pathname])
```

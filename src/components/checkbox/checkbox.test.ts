import { testStyleOnlyElement } from "../../testing/style-only-element";

testStyleOnlyElement({
  directive: "ngCheckbox",
  name: "checkbox",
  selector: 'input[type="checkbox"][ng-checkbox]',
});

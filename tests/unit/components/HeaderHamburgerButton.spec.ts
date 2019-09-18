import { createLocalVue, mount } from "@vue/test-utils";
import HeaderHamburgerButton from "../../../src/components/HeaderHamburgerButton.vue";
import VueCompositionApi from "@vue/composition-api";

describe("HeaderHamburgerButton.vue", (): void => {
    const localVue = createLocalVue();
    localVue.use(VueCompositionApi);

    it("renders", (): void => {
        expect.assertions(1);

        const wrapper = mount(HeaderHamburgerButton, {
            localVue,
            propsData: {
                isOpen: false
            }
        });

        expect(wrapper).toMatchInlineSnapshot(`
            <div class="button-wrapper">
              <div class="bar-1"><svg width="24" height="24" viewBox="0 0 24 24" class="icon">
                  <path d="M19,13H5V11H19V13Z"></path>
                </svg></div>
              <div class="bar-2"><svg width="24" height="24" viewBox="0 0 24 24" class="icon">
                  <path d="M19,13H5V11H19V13Z"></path>
                </svg></div>
              <div class="bar-3"><svg width="24" height="24" viewBox="0 0 24 24" class="icon">
                  <path d="M19,13H5V11H19V13Z"></path>
                </svg></div>
            </div>
        `);
    });
});
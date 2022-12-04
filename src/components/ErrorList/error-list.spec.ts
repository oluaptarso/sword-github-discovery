import { mount } from "@vue/test-utils";
import { describe, expect, test } from "vitest";
import ErrorList from "./ErrorList.vue";

describe("ErrorList Component", () => {
  const errors = ["Ohh no, we got an error over here", "It seems that we have two"];

  const wrapper = mount(ErrorList, {
    props: {
      errors,
    },
  });

  test("It should have rendered", () => {
    expect(wrapper.exists).toBeTruthy();
    expect(wrapper.attributes("name")).toBe("error-list");
  });

  test("It should have two errors rendered", () => {
    const errorsItems = wrapper.findAll("li");
    expect(errorsItems.length).toBe(2);
    expect(errorsItems[0].text()).toBe(errors[0]);
    expect(errorsItems[1].text()).toBe(errors[1]);
  });
});

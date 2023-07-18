import { renderHook } from "@testing-library/react-hooks";
import { useRouter } from "next/router";
import { useTypedSelector } from "..";
import { useAdmin } from "../useAdmin";
import { NextRouter } from "next/router";

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock("..");

describe("useAdmin", () => {
  it("should redirect to home page if user is not an admin", () => {
    const routerPushMock = jest.fn();
    const useTypedSelectorMock = useTypedSelector as jest.MockedFunction<
      typeof useTypedSelector
    >;
    useTypedSelectorMock.mockReturnValue({ data: { isAdmin: false } });
    const routerMock: any = {
      basePath: "",
      push: routerPushMock,
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
    };
    (useRouter as jest.MockedFunction<typeof useRouter>).mockReturnValue(
      routerMock
    );

    renderHook(() => useAdmin());

    expect(routerPushMock).toHaveBeenCalledWith("/");
  });
});

it("should not redirect if user is an admin", () => {
  const routerPushMock = jest.fn();
  const useTypedSelectorMock = useTypedSelector as jest.MockedFunction<
    typeof useTypedSelector
  >;
  const routerMock: any = {
    basePath: "",
    push: routerPushMock,
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
    },
  };
  useTypedSelectorMock.mockReturnValue({ data: { isAdmin: true } });
  (useRouter as jest.MockedFunction<typeof useRouter>).mockReturnValue(
    routerMock
  );

  renderHook(() => useAdmin());

  expect(routerPushMock).not.toHaveBeenCalled();
});

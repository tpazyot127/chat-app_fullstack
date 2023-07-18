import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { useStore } from "../redux";
import MyApp from "../pages/_app";

jest.mock("../redux");

describe("MyApp", () => {
  it("should render the component with the correct props", () => {
    const initialState = { user: { data: { name: "John Doe" } } };
    const store = useStore(initialState);

    const { getByText } = render(
      <Provider store={store}>
        <MyApp
          Component={() => <div>Test Component</div>}
          pageProps={{}}
          router={{ pathname: "/", query: {} } as any}
        />
      </Provider>
    );

    expect(getByText("Test Component")).toBeInTheDocument();
    expect(getByText("John Doe")).toBeInTheDocument();
  });

  it("should render the ToastContainer with the correct props", () => {
    const initialState = { user: { data: { name: "John Doe" } } };
    const store = useStore(initialState);

    const { getByRole } = render(
      <Provider store={store}>
        <MyApp
          Component={() => <div>Test Component</div>}
          pageProps={{}}
          router={{ pathname: "/", query: {} } as any}
        />
      </Provider>
    );

    const toastContainer = getByRole("alert");
    expect(toastContainer).toBeInTheDocument();
    expect(toastContainer).toHaveAttribute("data-theme", "dark");
  });

  it("should render the MainLayout and Container components", () => {
    const initialState = { user: { data: { name: "John Doe" } } };
    const store = useStore(initialState);

    const { getByRole } = render(
      <Provider store={store}>
        <MyApp
          Component={() => <div>Test Component</div>}
          pageProps={{}}
          router={{ pathname: "/", query: {} } as any}
        />
      </Provider>
    );

    const mainLayout = getByRole("main");
    expect(mainLayout).toBeInTheDocument();

    const container = getByRole("region");
    expect(container).toBeInTheDocument();
  });
});

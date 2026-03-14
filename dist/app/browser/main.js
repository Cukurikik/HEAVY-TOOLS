import {
  Actions,
  createEffect,
  ofType,
  provideEffects
} from "./chunk-UO3JI5KX.js";
import {
  addTask,
  completeTask,
  failTask,
  setActiveRoute,
  setFfmpegLoaded,
  setNetworkStatus,
  setOnnxLoaded,
  setOpfsAvailable,
  setSidebarCollapsed,
  toggleSidebar,
  updateMemoryUsage,
  updateTaskProgress
} from "./chunk-ILRANHO7.js";
import {
  RouterOutlet,
  provideRouter
} from "./chunk-ZI72GIQ4.js";
import {
  bootstrapApplication
} from "./chunk-DRIX56V4.js";
import {
  createReducer,
  on,
  provideStore
} from "./chunk-KGVNL5XR.js";
import "./chunk-UWT53CRV.js";
import {
  ChangeDetectionStrategy,
  Component,
  Injectable,
  inject,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
  setClassMetadata,
  tap,
  ɵsetClassDebugInfo,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵelement
} from "./chunk-3GKPD7AG.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-KWSTWQNB.js";

// src/app/app.ts
var App = class _App {
  static \u0275fac = function App_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _App)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _App, selectors: [["app-root"]], decls: 1, vars: 0, template: function App_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275element(0, "router-outlet");
    }
  }, dependencies: [RouterOutlet], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(App, [{
    type: Component,
    args: [{ changeDetection: ChangeDetectionStrategy.Eager, selector: "app-root", imports: [RouterOutlet], template: "<router-outlet />\r\n" }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(App, { className: "App", filePath: "src/app/app.ts", lineNumber: 11 });
})();

// src/app/app.routes.ts
var routes = [
  __spreadValues({
    path: "",
    loadComponent: () => import("./chunk-7OJGM7FS.js").then((m) => m.ShellComponent),
    children: [
      { path: "", loadComponent: () => import("./chunk-NN62CZZZ.js").then((m) => m.DashboardComponent) },
      {
        path: "video",
        children: [
          { path: "", loadComponent: () => import("./chunk-G3EIR3LM.js").then((m) => m.VideoEngineComponent) },
          { path: "", loadChildren: () => import("./chunk-LZF3F3KO.js").then((m) => m.VIDEO_ROUTES) }
        ]
      },
      {
        path: "audio",
        children: [
          { path: "", loadChildren: () => import("./chunk-K6HVGADY.js").then((m) => m.AUDIO_ROUTES) }
        ]
      },
      {
        path: "pdf",
        children: [
          { path: "", loadChildren: () => import("./chunk-HUC2RSL5.js").then((m) => m.PDF_ROUTES) }
        ]
      },
      { path: "image", loadComponent: () => import("./chunk-K66H6YRN.js").then((m) => m.ImageMatrixComponent) },
      {
        path: "converter",
        children: [
          { path: "", loadChildren: () => import("./chunk-AFV4VAC3.js").then((m) => m.CONVERTER_ROUTES) }
        ]
      },
      { path: "settings", loadComponent: () => import("./chunk-PZFVP6W7.js").then((m) => m.SettingsComponent) }
    ]
  }, false ? { \u0275entryName: "src/app/layout/shell/shell.component.ts" } : {}),
  { path: "**", redirectTo: "" }
];

// src/app/store/app.reducer.ts
var initialState = {
  sidebar: {
    collapsed: false,
    activeRoute: "/"
  },
  system: {
    ffmpegLoaded: false,
    onnxLoaded: false,
    opfsAvailable: true,
    networkStatus: "online",
    memoryUsage: 0
  },
  tasks: {
    active: [],
    history: [],
    totalCompleted: 0
  }
};
var appReducer = createReducer(initialState, on(toggleSidebar, (state) => __spreadProps(__spreadValues({}, state), {
  sidebar: __spreadProps(__spreadValues({}, state.sidebar), {
    collapsed: !state.sidebar.collapsed
  })
})), on(setSidebarCollapsed, (state, { collapsed }) => __spreadProps(__spreadValues({}, state), {
  sidebar: __spreadProps(__spreadValues({}, state.sidebar), {
    collapsed
  })
})), on(setActiveRoute, (state, { route }) => __spreadProps(__spreadValues({}, state), {
  sidebar: __spreadProps(__spreadValues({}, state.sidebar), {
    activeRoute: route
  })
})), on(setNetworkStatus, (state, { status }) => __spreadProps(__spreadValues({}, state), {
  system: __spreadProps(__spreadValues({}, state.system), {
    networkStatus: status
  })
})), on(setFfmpegLoaded, (state, { loaded }) => __spreadProps(__spreadValues({}, state), {
  system: __spreadProps(__spreadValues({}, state.system), {
    ffmpegLoaded: loaded
  })
})), on(setOnnxLoaded, (state, { loaded }) => __spreadProps(__spreadValues({}, state), {
  system: __spreadProps(__spreadValues({}, state.system), {
    onnxLoaded: loaded
  })
})), on(setOpfsAvailable, (state, { available }) => __spreadProps(__spreadValues({}, state), {
  system: __spreadProps(__spreadValues({}, state.system), {
    opfsAvailable: available
  })
})), on(updateMemoryUsage, (state, { usage }) => __spreadProps(__spreadValues({}, state), {
  system: __spreadProps(__spreadValues({}, state.system), {
    memoryUsage: usage
  })
})), on(addTask, (state, { task }) => __spreadProps(__spreadValues({}, state), {
  tasks: __spreadProps(__spreadValues({}, state.tasks), {
    active: [...state.tasks.active, task]
  })
})), on(updateTaskProgress, (state, { id, progress }) => __spreadProps(__spreadValues({}, state), {
  tasks: __spreadProps(__spreadValues({}, state.tasks), {
    active: state.tasks.active.map((t) => t.id === id ? __spreadProps(__spreadValues({}, t), { progress }) : t)
  })
})), on(completeTask, (state, { id }) => {
  const task = state.tasks.active.find((t) => t.id === id);
  if (!task)
    return state;
  const completedTask = __spreadProps(__spreadValues({}, task), { status: "success", progress: 100 });
  return __spreadProps(__spreadValues({}, state), {
    tasks: {
      active: state.tasks.active.filter((t) => t.id !== id),
      history: [completedTask, ...state.tasks.history],
      totalCompleted: state.tasks.totalCompleted + 1
    }
  });
}), on(failTask, (state, { id }) => {
  const task = state.tasks.active.find((t) => t.id === id);
  if (!task)
    return state;
  const failedTask = __spreadProps(__spreadValues({}, task), { status: "error" });
  return __spreadProps(__spreadValues({}, state), {
    tasks: {
      active: state.tasks.active.filter((t) => t.id !== id),
      history: [failedTask, ...state.tasks.history],
      totalCompleted: state.tasks.totalCompleted
    }
  });
}));

// src/app/store/app.state.ts
var reducers = {
  app: appReducer
};

// src/app/store/app.effects.ts
var AppEffects = class _AppEffects {
  actions$ = inject(Actions);
  // Example effect: log when a task fails
  logFailedTask$ = createEffect(() => {
    return this.actions$.pipe(ofType(failTask), tap(({ id }) => console.error(`Task ${id} failed`)));
  }, { dispatch: false });
  static \u0275fac = function AppEffects_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AppEffects)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _AppEffects, factory: _AppEffects.\u0275fac });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AppEffects, [{
    type: Injectable
  }], null, null);
})();

// src/app/app.config.ts
var appConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideStore(reducers),
    provideEffects([AppEffects])
  ]
};

// src/main.ts
bootstrapApplication(App, appConfig).catch((err) => console.error(err));
//# sourceMappingURL=main.js.map

import type WdpApi from "wdpapi";

type AppInstance = InstanceType<typeof WdpApi>;

// 场景事件
enum SceneEventType {
  OnWdpSceneIsReady = "OnWdpSceneIsReady",
  OnWdpSceneChanged = "OnWdpSceneChanged",
  OnMouseEnterEntity = "OnMouseEnterEntity",
  OnMouseOutEntity = "OnMouseOutEntity",
  OnEntityClicked = "OnEntityClicked",
  OnEntityDbClicked = "OnEntityDbClicked",
  OnWebJSEvent = "OnWebJSEvent",
  MeasureResult = "MeasureResult",
  OnMoveAlongPathProcessEvent = "OnMoveAlongPathProcessEvent",
  OnRealTimeVideoEvent = "OnRealTimeVideoEvent",
  OnCameraMotionEndEvent = "OnCameraMotionEndEvent",
  OnCameraRoamingFrame = "OnCameraRoamingFrame",
  PickPointEvent = "PickPointEvent",
  OnEntitySelectionChanged = "OnEntitySelectionChanged",
  OnEntityNodeSelectionChanged = "OnEntityNodeSelectionChanged",
  OnEntityReady = "OnEntityReady",
  OnCreateGeoLayerEvent = "OnCreateGeoLayerEvent",
  OnGeoLayerFeatureClicked = "OnGeoLayerFeatureClicked",
  elementClick = "elementClick",
  elementHovered = "elementHovered",
  elementUnHovered = "elementUnHovered",
}

// 云渲染事件
enum CloudEventType {
  onStopedRenderCloud = "onStopedRenderCloud",
  onVideoReady = "onVideoReady",
}

// 错误事件
enum ErrorEventType {
  OnValidateError = "OnValidateError",
}

type WdpEventType = SceneEventType | CloudEventType | ErrorEventType;
type EventType = WdpEventType | string;

export default abstract class EventListener {
  abstract app: AppInstance | undefined;
  eventMap: Map<EventType, Array<(...args: any[]) => void>> = new Map();
  pendingEvents = new Set<EventType>();

  private getRegistrar(eventName: EventType) {
    if (Object.values(SceneEventType).includes(eventName as SceneEventType)) {
      return "RegisterSceneEvent";
    }
    if (Object.values(CloudEventType).includes(eventName as CloudEventType)) {
      return "RegisterEvent";
    }
    if (Object.values(ErrorEventType).includes(eventName as ErrorEventType)) {
      return "RegisterErrorEvent";
    }
  }

  private getUnRegistrar(eventName: EventType) {
    if (Object.values(SceneEventType).includes(eventName as SceneEventType)) {
      return "UnRegisterSceneEvent";
    }
    if (Object.values(CloudEventType).includes(eventName as CloudEventType)) {
      return "UnRegisterEvent";
    }
    if (Object.values(ErrorEventType).includes(eventName as ErrorEventType)) {
      return "UnRegisterErrorEvent";
    }
  }

  private isValidEventName(eventName: string) {
    return Object.values(SceneEventType).includes(eventName as SceneEventType)
      || Object.values(CloudEventType).includes(eventName as CloudEventType)
      || Object.values(ErrorEventType).includes(eventName as ErrorEventType);
  }

  protected registerPendingEvents() {
    this.pendingEvents.forEach((eventName) => {
      const registrar = this.getRegistrar(eventName);
      if (registrar && this.app) {
        this.app.Renderer[registrar]([{
          name: eventName,
          func: (...args) => {
            this.emit(eventName, ...args);
          },
        }]);
      }
    });
    // 清空待处理事件
    this.pendingEvents.clear();
  }

  private onRegistrar(eventName: EventType) {
    if (!this.isValidEventName(eventName)) return;
    const registrar = this.getRegistrar(eventName);
    if (registrar) {
      if (!this.app) {
        this.pendingEvents.add(eventName);
        return;
      }
      this.app?.Renderer[registrar]([{
        name: eventName,
        func: (...args) => {
          this.emit(eventName, ...args);
        },
      }]);
    }
  }

  private offRegistrar(eventName: EventType) {
    if (!this.isValidEventName(eventName)) return;
    const unRegistrar = this.getUnRegistrar(eventName);
    if (unRegistrar) {
      this.app?.Renderer[unRegistrar]([eventName]);
    }
  }

  on(eventName: EventType, callback: (...args: any[]) => void) {
    if (!this.eventMap.has(eventName)) {
      this.eventMap.set(eventName, []);
      this.onRegistrar(eventName);
    }
    this.eventMap.get(eventName)?.push(callback);
  }

  off(eventName: EventType, callback?: (...args: any[]) => void) {
    if (!this.eventMap.has(eventName)) return;
    if (!callback) {
      this.eventMap.delete(eventName);
      this.offRegistrar(eventName);
      return;
    }
    const index = this.eventMap.get(eventName)?.indexOf(callback);
    if (index && index !== -1) {
      this.eventMap.get(eventName)?.splice(index, 1);
    }
  }

  once(eventName: EventType, callback: (...args: any[]) => void) {
    this.on(
      eventName,
      (...args) => {
        this.off(eventName, callback);
        callback(...args);
      },
    );
  }

  offAll() {
    this.eventMap.forEach((callbacks, eventName) => {
      this.off(eventName);
    });
  }

  emit(eventName: EventType, ...args: any[]) {
    if (!this.eventMap.has(eventName)) {
      return;
    }
    this.eventMap.get(eventName)?.forEach((callback) => {
      callback(...args);
    });
  }
}

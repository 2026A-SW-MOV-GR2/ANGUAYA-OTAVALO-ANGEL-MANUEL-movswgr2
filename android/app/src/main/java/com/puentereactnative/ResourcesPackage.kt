package com.puentereactnative

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

// Un Package es una "lista de módulos" que React Native carga al iniciar.
// Es obligatorio para que MainApplication sepa que existe tu módulo.
class ResourcesPackage : ReactPackage {

    // Aquí se registra TODOS los Native Modules que se crean.
    // Si se crea más módulos, se los agrega a esta lista.
    override fun createNativeModules(
        reactContext: ReactApplicationContext
    ): List<NativeModule> {
        return listOf(ResourcesModule(reactContext))
    }

    // Esto es para componentes visuales nativos (View Managers).
    override fun createViewManagers(
        reactContext: ReactApplicationContext
    ): List<ViewManager<*, *>> {
        return emptyList()
    }
}
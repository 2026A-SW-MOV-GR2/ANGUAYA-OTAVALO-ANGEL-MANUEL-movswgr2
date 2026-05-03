package com.puentereactnative

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.Arguments
import android.graphics.Color

class ResourcesModule(reactContext: ReactApplicationContext): ReactContextBaseJavaModule(reactContext) {

    // con este nombre de le llama del JS
    override fun getName(): String {
        return "ResourcesModule"
    }

    // Expone el metodo puente, porque sin ella JS no puede llamarlo
    // el parámetro  Promise permite que la llamada sea asíncronica.
    @ReactMethod
    fun getStrings(promise: Promise){
        try {
            // reactApplicationContext es el contexto de Android que RN nos da
            // busca en las carpetas correspondientes dependiente de lo que se haga
            val context = reactApplicationContext
            val saludo = context.getString(R.string.saludo)
            val orientacion = context.getString(R.string.orientacion_label)

            // WritableMap es como un hashmap, pero serializable al puente.
            val resultado: WritableMap = Arguments.createMap()
            resultado.putString("saludo", saludo)
            resultado.putString("orientacion", orientacion)

            promise.resolve(resultado)

        } catch (e: Exception){
            promise.reject("ERROR_STRINGS", e.message, e)
        }

    }

    // Se devuelve los colores como
    // strings en formato hexadecimal (#RRGGBB), porque JS no entiende
    // el tipo Color de Android directamente.
    @ReactMethod
    fun getColors(promise: Promise) {
        try {
            val context = reactApplicationContext

            // ContextCompat.getColor o context.getColor() devuelve un Int
            // que representa el color. Hay que convertirlo a hex para JS.
            val colorTexto = context.getColor(R.color.texto)
            val colorFondo = context.getColor(R.color.fondo)

            val resultado: WritableMap = Arguments.createMap()
            // String.format con %06X convierte el Int a hexadecimal de 6 dígitos.
            // El & 0xFFFFFF elimina el canal alfa (transparencia) que no usamos.
            resultado.putString("texto", String.format("#%06X", 0xFFFFFF and colorTexto))
            resultado.putString("fondo", String.format("#%06X", 0xFFFFFF and colorFondo))

            promise.resolve(resultado)
        } catch (e: Exception) {
            promise.reject("ERROR_COLORS", e.message, e)
        }
    }
}
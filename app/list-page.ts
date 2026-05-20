import { EventData, Page, Application, Utils, Frame, ObservableArray, fromObject } from '@nativescript/core';

// Datos estáticos requeridos por la guía
const itemsList = new ObservableArray([
    { id: 1, title: "Google Pixel 8", subtitle: "Android 14" },
    { id: 2, title: "MacBook Pro", subtitle: "Apple M3" }
]);

export function onNavigatingTo(args: EventData) {
    const page = <Page>args.object;
    page.bindingContext = fromObject({ items: itemsList });
}

export function onAddTap() {
    Frame.topmost().navigate("form-page"); // Navega a Create
}

export function onItemTap(args: any) {
    const item = itemsList.getItem(args.index);
    Frame.topmost().navigate({
        moduleName: "form-page",
        context: { item: item } // Pasamos los datos para Update
    });
}

// ⚠️ EL RETO NATIVO: Diálogo y Toast 100% Android ⚠️
export function onDeleteTap(args: EventData) {
    const view = <any>args.object;
    const item = view.bindingContext;
    const index = itemsList.indexOf(item);

    if (Application.android) {
        // 1. Obtenemos el Activity de Android actual
        const activity = Application.android.foregroundActivity;
        
        // 2. Instanciamos la clase de Java directamente en TS
        const builder = new android.app.AlertDialog.Builder(activity);
        builder.setTitle("Confirmar Eliminación");
        builder.setMessage(`¿Deseas eliminar "${item.title}"?`);
        
        // 3. Listener nativo para el botón positivo
        builder.setPositiveButton("Eliminar", new android.content.DialogInterface.OnClickListener({
            onClick: function (dialog, which) {
                // Borramos del array estático
                itemsList.splice(index, 1);
                
                // 4. Instanciamos el Toast nativo
                const context = Utils.android.getApplicationContext();
                android.widget.Toast.makeText(
                    context, 
                    "Elemento eliminado exitosamente", 
                    android.widget.Toast.LENGTH_SHORT
                ).show();
            }
        }));
        
        builder.setNegativeButton("Cancelar", null);
        builder.show();
    }
}
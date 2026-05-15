import { EventData, Page, Application, Utils, Frame, ObservableArray, fromObject } from '@nativescript/core';

// Datos en duro (Array estático)
const itemsList = new ObservableArray([
    { id: 1, title: "Elemento 1", subtitle: "Descripción del primero" },
    { id: 2, title: "Elemento 2", subtitle: "Descripción del segundo" }
]);

export function onNavigatingTo(args: EventData) {
    const page = <Page>args.object;
    page.bindingContext = fromObject({ items: itemsList });
}

export function onAddTap() {
    Frame.topmost().navigate("form-page");
}

export function onItemTap(args: any) {
    const item = itemsList.getItem(args.index);
    Frame.topmost().navigate({
        moduleName: "form-page",
        context: { item: item } // Pasamos datos para Update
    });
}

// RETO NATIVO: Instanciación directa de clases Android
export function onDeleteTap(args: EventData) {
    const view = <any>args.object;
    const item = view.bindingContext;
    const index = itemsList.indexOf(item);

    if (Application.android) {
        // 1. Contexto de la Actividad para el Dialog
        const activity = Application.android.foregroundActivity;
        const builder = new android.app.AlertDialog.Builder(activity);
        
        builder.setTitle("Confirmar Eliminación");
        builder.setMessage(`¿Deseas eliminar "${item.title}"?`);
        
        // Listener Nativo para confirmar
        builder.setPositiveButton("Eliminar", new android.content.DialogInterface.OnClickListener({
            onClick: function (dialog, which) {
                itemsList.splice(index, 1);
                
                // 2. Contexto de la Aplicación para el Toast
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
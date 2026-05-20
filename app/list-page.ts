import { EventData, Page, Application, Utils, Frame, ObservableArray, fromObject } from '@nativescript/core';

// 1. Array estático CON IMÁGENES (URLs)
const itemsList = new ObservableArray([
    { 
        id: 1, 
        title: "Google Pixel 8", 
        subtitle: "Android 14",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Android_robot.svg/500px-Android_robot.svg.png" 
    },
    { 
        id: 2, 
        title: "MacBook Pro", 
        subtitle: "Apple M3",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/500px-Apple_logo_black.svg.png" 
    }
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
        context: { item: item }
    });
}

// 2. EL RETO NATIVO: Dialog y Toast sin abstracciones
export function onDeleteTap(args: EventData) {
    const view = <any>args.object;
    const item = view.bindingContext;
    const index = itemsList.indexOf(item);

    if (Application.android) {
        const activity = Application.android.foregroundActivity;
        
        // Instancia directa de la clase Java
        const builder = new android.app.AlertDialog.Builder(activity);
        builder.setTitle("Confirmar Eliminación");
        builder.setMessage(`¿Deseas eliminar "${item.title}"?`);
        
        builder.setPositiveButton("Eliminar", new android.content.DialogInterface.OnClickListener({
            onClick: function (dialog, which) {
                itemsList.splice(index, 1);
                
                const context = Utils.android.getApplicationContext();
                // Instancia directa del Toast nativo
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
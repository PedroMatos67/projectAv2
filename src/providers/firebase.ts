import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreCollection
} from "angularfire2/firestore";
import { Observable } from "rxjs";
import "rxjs/add/operator/map";

@Injectable()
export class FirebaseProvider {
  constructor(private afs: AngularFirestore) {}

 
  saveUser = data =>
    this.afs
      .collection("Users")
      .doc(data.$key)
      .update(data);

  
  postUser = data =>
    this.afs
      .collection("Users")
      .doc(data.uid)
      .set(data);

  
  postOrder = data => this.afs.collection("Orders").add(data);

 
  getCurrentUser = uid => {
    const collection: AngularFirestoreCollection<any> = this.afs.collection(
      "Users",
      ref => ref.where("uid", "==", uid)
    );
    const collection$: Observable<any> = collection
      .snapshotChanges()
      .map(actions => {
        return actions.map(action => ({
          $key: action.payload.doc.id,
          ...action.payload.doc.data()
        }));
      });
    return collection$;
  };

  
  getProducts = () => {
    const collection: AngularFirestoreCollection<any> = this.afs.collection(
      "Products"
    );
    const collection$: Observable<any> = collection
      .snapshotChanges()
      .map(actions => {
        return actions.map(action => ({
          $key: action.payload.doc.id,
          ...action.payload.doc.data()
        }));
      });
    return collection$;
  }
}

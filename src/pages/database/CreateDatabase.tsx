import React from "react";
import CreateEntityForm from "../../components/CreateEntityForm";
import {useAppDispatch} from "../../store/hooks";
import * as Yup from 'yup';
import {createEntity} from "../../store/crud/crud.actions";
import FormGenerator, {Field} from "../../components/Forms/FormGenerator";
import PageContent from "../../layouts/dashboard/PageContent";

const CreateDatabase = () => {
    /*return (
        <CreateEntityForm
            entity="database"
            fields={[
                {name: "type", label: "type", required: true},
                {name: "host", label: "Host", required: true},
                {name: "user", label: "User", required: true},
                {name: "password", label: "Password", type: "password"},
                {name: "name", label: "Name", required: true},
            ]}
            onSuccess={() => alert("User created successfully!")}
        />
    );*/
    const dispatch = useAppDispatch();

    // Define form fields with types and validation rules
    const fields: Field[] = [
        {
            name: "type",
            label: "Type",
            type: "text",
            //columnSize: 6,
            validationRules: Yup.string().required("Type is required"),
        },
        {
            name: "host",
            label: "Host",
            type: "text",
            //columnSize: 6,
            validationRules: Yup.string().required("Host is required"),
        },
        {
            name: "user",
            label: "User",
            type: "text",
            //columnSize: 6,
            validationRules: Yup.string().required("User is required"),
        },
        {
            name: "password",
            label: "Password",
            type: "password",
            //columnSize: 6,
            validationRules: Yup.string(), // Password can be optional
        },
        {
            name: "name",
            label: "Name",
            type: "text",
            //columnSize: 6,
            validationRules: Yup.string().required("Name is required"),
        },
        {
            name: "location",
            label: "Location",
            type: "autocomplete",
            options: [{label: 'label 1', value: 'value_1'}, {label: 'label 2', value: 'value_2'}],
            columnSize: 12,
            validationRules: Yup.string().required("Location is required"),
        },
    ];

    const handleSubmit = async (formData: Record<string, any>) => {
        try {
            await dispatch(createEntity('database', formData) as any);
            alert('Entity created successfully!');
        } catch (error) {
            console.error("Error creating entity:", error);
        }
    };

    return (
        <PageContent title={'New Database'} sidebar={<></>}>
            <FormGenerator
                fields={fields}
                onSubmit={handleSubmit}
                submitText="Create"
            />
        </PageContent>
    );
};

export default CreateDatabase;
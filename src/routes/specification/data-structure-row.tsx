import {DataStructure} from "../../interfaces/data-structure";
import {StoreInfo} from "./store-info";
import {Box, Button, Switch, TableCell, TableRow, Typography} from "@mui/material";
import React, {useCallback, useEffect} from "react";
import axios from "axios";

export interface DataStructureRowProps {
    dataStructure: DataStructure;
    schemaGeneratorUrls: [string, string][];

    specificationId: string;
    reloadSpecification: () => void;
}

export const DataStructureRow: React.FC<DataStructureRowProps> = ({dataStructure, schemaGeneratorUrls, specificationId, reloadSpecification}) => {
    const deleteDataPsm = useCallback(async () => {
        await axios.delete(`${process.env.REACT_APP_BACKEND}/specification/${specificationId}/data-psm/${dataStructure.id}`);
        reloadSpecification?.();
    }, [reloadSpecification, specificationId, dataStructure.id]);

    const [switchLoading, setSwitchLoading] = React.useState<string[]>([]);
    useEffect(() => {
        setSwitchLoading([]);
    }, [dataStructure]);

    const switchChanged = useCallback(async (type: string) => {
        setSwitchLoading([...switchLoading, type]);
        const artifacts = [] as string[];
        if (dataStructure.artifact_xml !== (type === "xml")) {
            artifacts.push("xml");
        }
        if (dataStructure.artifact_json !== (type === "json")) {
            artifacts.push("json");
        }
        await axios.post(`${process.env.REACT_APP_BACKEND}/specification/${specificationId}/data-psm/${dataStructure.id}`, {artifacts});
        reloadSpecification?.();
    }, [reloadSpecification, specificationId, switchLoading]);

    return <TableRow key={dataStructure.id}>
        <StoreInfo storeId={dataStructure?.store ?? null}>
            {(name, operations, resources) =>
                <>
                    <TableCell component="th" scope="row" sx={{width: "25%"}}>
                        <Typography sx={{fontWeight: "bold"}}>
                            {name ?? "-"}
                        </Typography>
                    </TableCell>
                    <TableCell>
                        <Typography>{operations ?? "-"}</Typography>
                    </TableCell>
                    <TableCell>
                        <Typography>{resources ?? "-"}</Typography>
                    </TableCell>
                </>
            }
        </StoreInfo>

        <TableCell>
            <Switch checked={dataStructure.artifact_json} disabled={switchLoading.includes('json')} onClick={() => switchChanged('json')}/>
        </TableCell>
        <TableCell>
            <Switch checked={dataStructure.artifact_xml} disabled={switchLoading.includes('xml')} onClick={() => switchChanged('xml')}/>
        </TableCell>
        <TableCell align="right">
            <Box
                sx={{
                    display: "flex",
                    gap: "1rem",
                    justifyContent: "flex-end"
                }}>
                {schemaGeneratorUrls.map(([branch, url]) => {
                        const urlObject = new URL(url);
                        urlObject.searchParams.append('configuration', `${process.env.REACT_APP_BACKEND}/configuration/by-data-psm/${dataStructure.id}`);
                        return <Button variant={"contained"} color={"primary"} key={url} href={urlObject.toString()}>Edit ({branch})</Button>;
                    }
                )}
                {/*<Button variant="outlined" color={"primary"} href={`${process.env.REACT_APP_BACKEND}/configuration/by-data-psm/${dataStructure.id}`}>See configuration</Button>*/}
                <Button
                    variant="outlined"
                    color={"error"}
                    onClick={deleteDataPsm}>Delete</Button>
            </Box>
        </TableCell>
    </TableRow>;
};

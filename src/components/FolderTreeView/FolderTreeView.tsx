import React, {useState} from "react";
import {Box, Typography, Paper, useTheme} from "@mui/material";
import {ExpandMore, ExpandLess, TableChart} from "@mui/icons-material";
import AddBoxIcon from '@mui/icons-material/AddBox';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import Divider from "@mui/material/Divider";
import Toolbar from "@mui/material/Toolbar";

interface SchemaChild {
    label: string;
    type: string;
}

export interface SchemaItem {
    key: string;
    label: string;
    children: SchemaChild[];
}

interface FolderTreeViewProps {
    title: string;
    data: SchemaItem[];
}

const FolderTreeView: React.FC<FolderTreeViewProps> = ({title, data}) => {
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});

    const theme = useTheme();

    const toggleExpand = (key: string) => {
        setExpanded((prev) => ({...prev, [key]: !prev[key]}));
    };

    return (

            <Box>
                {data.map((item, index) => (
                    <Box key={index} sx={{marginBottom: 1}}>
                        <Box sx={{display: "flex", alignItems: "center", cursor: "pointer"}}
                             onClick={() => toggleExpand(item.key)}>

                            {expanded[item.key] ? <RemoveCircleIcon sx={{marginRight: 1}} color={'primary'}/> :
                                <AddBoxIcon sx={{marginRight: 1}} color={'primary'}/>}

                            <Typography variant="subtitle1" sx={{display: 'flex', alignItems: 'center'}}>
                                {item.label}
                            </Typography>
                        </Box>
                        {expanded[item.key] && (
                            <Box sx={{paddingLeft: 1.5, borderLeft: "2px solid #ccc", marginLeft: 1.5}}>
                                {item.children.map((child, idx) => (
                                    <Typography key={idx} sx={{marginLeft: 1}} variant={'body2'}>
                                        ├─ {child.label} <span style={{color: "#888"}}>[{child.type}]</span>
                                    </Typography>
                                ))}
                            </Box>
                        )}
                    </Box>
                ))}
            </Box>
    );
};

export default FolderTreeView;
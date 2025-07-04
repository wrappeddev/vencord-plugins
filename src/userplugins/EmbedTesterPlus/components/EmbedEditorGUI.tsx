/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { React, useState } from "@webpack/common";
import { EmbedData, hexToDecimal, decimalToHex, exportEmbedAsJSON, exportEmbedAsMarkdown } from "../utils/embedUtils";
import { Toasts } from "@webpack/common";

const showToast = (message: string, type: any) => {
    // Fallback toast implementation
    console.log(`Toast: ${message}`);
};

interface EmbedEditorGUIProps {
    embedData: EmbedData;
    onChange: (embed: EmbedData) => void;
}

export function EmbedEditorGUI({ embedData, onChange }: EmbedEditorGUIProps) {
    const [colorInput, setColorInput] = useState(embedData.color ? decimalToHex(embedData.color) : "#5865F2");

    const updateEmbed = (updates: Partial<EmbedData>) => {
        onChange({ ...embedData, ...updates });
    };

    const updateField = (index: number, updates: Partial<EmbedData['fields'][0]>) => {
        const newFields = [...(embedData.fields || [])];
        newFields[index] = { ...newFields[index], ...updates };
        updateEmbed({ fields: newFields });
    };

    const addField = () => {
        const newFields = [...(embedData.fields || []), { name: "New Field", value: "Field value", inline: false }];
        updateEmbed({ fields: newFields });
    };

    const removeField = (index: number) => {
        const newFields = embedData.fields?.filter((_, i) => i !== index) || [];
        updateEmbed({ fields: newFields });
    };

    const handleColorChange = (hex: string) => {
        setColorInput(hex);
        try {
            const decimal = hexToDecimal(hex);
            updateEmbed({ color: decimal });
        } catch {
            // Invalid hex, don't update
        }
    };

    const copyJSON = () => {
        navigator.clipboard.writeText(exportEmbedAsJSON(embedData));
        showToast("JSON copied to clipboard!", Toasts.Type.SUCCESS);
    };

    const copyMarkdown = () => {
        navigator.clipboard.writeText(exportEmbedAsMarkdown(embedData));
        showToast("Markdown copied to clipboard!", Toasts.Type.SUCCESS);
    };

    const labelStyle: React.CSSProperties = {
        display: "block",
        marginBottom: "6px",
        fontSize: "13px",
        fontWeight: "600",
        color: "#be185d"
    };

    const sectionStyle: React.CSSProperties = {
        marginBottom: "20px",
        padding: "16px",
        border: "2px solid #f9a8d4",
        borderRadius: "12px",
        background: "linear-gradient(135deg, #fdf2f8, #fce7f3)",
        boxShadow: "0 2px 4px rgba(190, 24, 93, 0.1)"
    };

    return (
        <div style={{ height: "100%", overflow: "auto" }}>
            {/* Export Buttons */}
            <div style={{
                marginBottom: "20px",
                display: "flex",
                gap: "12px",
                padding: "12px",
                background: "rgba(249, 168, 212, 0.1)",
                borderRadius: "8px",
                border: "1px solid #f9a8d4"
            }}>
                <button
                    onClick={copyJSON}
                    style={{
                        padding: "8px 16px",
                        background: "linear-gradient(135deg, #ec4899, #be185d)",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        fontSize: "13px",
                        fontWeight: "600",
                        cursor: "pointer",
                        boxShadow: "0 2px 4px rgba(190, 24, 93, 0.3)"
                    }}
                >
                    Copy JSON
                </button>
                <button
                    onClick={copyMarkdown}
                    style={{
                        padding: "8px 16px",
                        background: "linear-gradient(135deg, #f472b6, #ec4899)",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        fontSize: "13px",
                        fontWeight: "600",
                        cursor: "pointer",
                        boxShadow: "0 2px 4px rgba(236, 72, 153, 0.3)"
                    }}
                >
                    Copy Markdown
                </button>
            </div>

            {/* Basic Fields */}
            <div style={sectionStyle}>
                <h4 style={{
                    margin: "0 0 16px 0",
                    color: "#be185d",
                    fontSize: "16px",
                    fontWeight: "700",
                    textShadow: "0 1px 2px rgba(190, 24, 93, 0.1)"
                }}>
                    Basic Information
                </h4>

                <div style={{ marginBottom: "12px" }}>
                    <label style={labelStyle}>Title ({embedData.title?.length || 0}/256)</label>
                    <input
                        type="text"
                        value={embedData.title || ""}
                        onChange={(e) => updateEmbed({ title: e.target.value })}
                        placeholder="Embed title"
                        className="embed-text-input"
                        maxLength={256}
                    />
                </div>

                <div style={{ marginBottom: "12px" }}>
                    <label style={labelStyle}>Description ({embedData.description?.length || 0}/4096)</label>
                    <textarea
                        value={embedData.description || ""}
                        onChange={(e) => updateEmbed({ description: e.target.value })}
                        placeholder="Embed description"
                        className="embed-textarea"
                        maxLength={4096}
                    />
                </div>

                <div style={{ marginBottom: "12px" }}>
                    <label style={labelStyle}>URL</label>
                    <input
                        type="url"
                        value={embedData.url || ""}
                        onChange={(e) => updateEmbed({ url: e.target.value })}
                        placeholder="https://example.com"
                        className="embed-text-input"
                    />
                </div>

                <div style={{ display: "flex", gap: "12px" }}>
                    <div style={{ flex: 1 }}>
                        <label style={labelStyle}>Color</label>
                        <input
                            type="color"
                            value={colorInput}
                            onChange={(e) => handleColorChange(e.target.value)}
                            className="embed-text-input"
                            style={{ height: "48px" }}
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={labelStyle}>Timestamp</label>
                        <input
                            type="datetime-local"
                            value={embedData.timestamp ? new Date(embedData.timestamp).toISOString().slice(0, 16) : ""}
                            onChange={(e) => updateEmbed({ timestamp: e.target.value ? new Date(e.target.value).toISOString() : undefined })}
                            className="embed-text-input"
                        />
                    </div>
                </div>
            </div>

            {/* Author */}
            <div style={sectionStyle}>
                <h4 style={{ margin: "0 0 12px 0", color: "#060607" }}>Author</h4>

                <div style={{ marginBottom: "12px" }}>
                    <label style={labelStyle}>Author Name ({embedData.author?.name?.length || 0}/256)</label>
                    <input
                        type="text"
                        value={embedData.author?.name || ""}
                        onChange={(e) => updateEmbed({
                            author: { ...embedData.author, name: e.target.value }
                        })}
                        placeholder="Author name"
                        className="embed-text-input"
                        maxLength={256}
                    />
                </div>

                <div style={{ display: "flex", gap: "12px" }}>
                    <div style={{ flex: 1 }}>
                        <label style={labelStyle}>Author URL</label>
                        <input
                            type="url"
                            value={embedData.author?.url || ""}
                            onChange={(e) => updateEmbed({
                                author: { ...embedData.author, url: e.target.value }
                            })}
                            placeholder="https://example.com"
                            className="embed-text-input"
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={labelStyle}>Author Icon URL</label>
                        <input
                            type="url"
                            value={embedData.author?.icon_url || ""}
                            onChange={(e) => updateEmbed({
                                author: { ...embedData.author, icon_url: e.target.value }
                            })}
                            placeholder="https://example.com/icon.png"
                            className="embed-text-input"
                        />
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div style={sectionStyle}>
                <h4 style={{ margin: "0 0 12px 0", color: "#060607" }}>Footer</h4>

                <div style={{ marginBottom: "12px" }}>
                    <label style={labelStyle}>Footer Text ({embedData.footer?.text?.length || 0}/2048)</label>
                    <input
                        type="text"
                        value={embedData.footer?.text || ""}
                        onChange={(e) => updateEmbed({
                            footer: { ...embedData.footer, text: e.target.value }
                        })}
                        placeholder="Footer text"
                        className="embed-text-input"
                        maxLength={2048}
                    />
                </div>

                <div>
                    <label style={labelStyle}>Footer Icon URL</label>
                    <input
                        type="url"
                        value={embedData.footer?.icon_url || ""}
                        onChange={(e) => updateEmbed({
                            footer: { ...embedData.footer, icon_url: e.target.value }
                        })}
                        placeholder="https://example.com/icon.png"
                        className="embed-text-input"
                    />
                </div>
            </div>

            {/* Images */}
            <div style={sectionStyle}>
                <h4 style={{ margin: "0 0 12px 0", color: "#060607" }}>Images</h4>

                <div style={{ marginBottom: "12px" }}>
                    <label style={labelStyle}>Image URL</label>
                    <input
                        type="url"
                        value={embedData.image?.url || ""}
                        onChange={(e) => updateEmbed({
                            image: e.target.value ? { url: e.target.value } : undefined
                        })}
                        placeholder="https://example.com/image.png"
                        className="embed-text-input"
                    />
                </div>

                <div>
                    <label style={labelStyle}>Thumbnail URL</label>
                    <input
                        type="url"
                        value={embedData.thumbnail?.url || ""}
                        onChange={(e) => updateEmbed({
                            thumbnail: e.target.value ? { url: e.target.value } : undefined
                        })}
                        placeholder="https://example.com/thumbnail.png"
                        className="embed-text-input"
                    />
                </div>
            </div>

            {/* Fields */}
            <div style={sectionStyle}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                    <h4 style={{ margin: 0, color: "#060607" }}>Fields ({embedData.fields?.length || 0}/25)</h4>
                    <button
                        onClick={addField}
                        disabled={(embedData.fields?.length || 0) >= 25}
                        style={{
                            padding: "4px 8px",
                            background: "#5865f2",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            fontSize: "12px",
                            cursor: "pointer"
                        }}
                    >
                        Add Field
                    </button>
                </div>

                {embedData.fields?.map((field, index) => (
                    <div key={index} style={{
                        padding: "12px",
                        border: "1px solid #e3e5e8",
                        borderRadius: "4px",
                        marginBottom: "8px",
                        background: "white"
                    }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                            <span style={{ fontSize: "12px", fontWeight: "600", color: "#4f5660" }}>
                                Field {index + 1}
                            </span>
                            <button
                                onClick={() => removeField(index)}
                                style={{
                                    padding: "2px 6px",
                                    background: "#ed4245",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "4px",
                                    fontSize: "10px",
                                    cursor: "pointer"
                                }}
                            >
                                Remove
                            </button>
                        </div>

                        <div style={{ marginBottom: "8px" }}>
                            <label style={labelStyle}>Name ({field.name?.length || 0}/256)</label>
                            <input
                                type="text"
                                value={field.name}
                                onChange={(e) => updateField(index, { name: e.target.value })}
                                placeholder="Field name"
                                className="embed-text-input"
                                maxLength={256}
                            />
                        </div>

                        <div style={{ marginBottom: "8px" }}>
                            <label style={labelStyle}>Value ({field.value?.length || 0}/1024)</label>
                            <textarea
                                value={field.value}
                                onChange={(e) => updateField(index, { value: e.target.value })}
                                placeholder="Field value"
                                className="embed-textarea"
                                style={{ height: "60px" }}
                                maxLength={1024}
                            />
                        </div>

                        <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#4f5660" }}>
                            <input
                                type="checkbox"
                                checked={field.inline || false}
                                onChange={(e) => updateField(index, { inline: e.target.checked })}
                            />
                            Inline
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
}

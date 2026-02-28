import React from 'react';

function Header({ dynasties, activeId, onSelect, activeDynasty }) {
    return (
        <header className="header">
            <div className="title-area">
                <h1>文脉官典</h1>
                <p className="subtitle">中国古代官制与文化图谱</p>
            </div>
            <div className="controls">
                <label htmlFor="dynastySelect">选择朝代：</label>
                <select
                    id="dynastySelect"
                    value={activeId}
                    onChange={(e) => onSelect(e.target.value)}
                >
                    {dynasties.map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                </select>
            </div>
            <div className="dynasty-info">
                <span id="dynastyDesc">{activeDynasty ? activeDynasty.description : ''}</span>
            </div>
        </header>
    );
}

export default Header;
